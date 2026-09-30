package com.estoque.service;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Chave secreta usada para assinar e validar os tokens.
    // Vem do application.properties (propriedade jwt.secret) através de @Value.
    // Precisa estar em Base64. NUNCA deixe essa chave hardcoded no código
    // nem versionada em repositório público.
    @Value("${jwt.secret}")
    private String secretKey;

    // Tempo de validade do token, em milissegundos.
    // Vem de application.properties (propriedade jwt.expiration).
    // Ex: 86400000 = 24 horas.
    @Value("${jwt.expiration}")
    private long expiration;

    // ------------------------------------------------------------------
    // GERAÇÃO DO TOKEN
    // Chamado depois que o login (usuário + senha) já foi validado com
    // sucesso pelo AuthenticationManager. Este método transforma um
    // usuário autenticado em uma string de token.
    //
    // NOTA DE VERSÃO: a partir do jjwt 0.12.x, os métodos perderam o
    // prefixo "set" (setSubject -> subject, setExpiration -> expiration).
    // ------------------------------------------------------------------
    public String gerarToken(UserDetails usuario) {
        return Jwts.builder()
                // "subject" é um campo padrão do JWT: representa o "dono" do token.
                // Aqui usamos o login do usuário.
                .subject(usuario.getUsername())

                // "claim" = qualquer informação extra que você quer embutir no token,
                // além dos campos padrão. Aqui guardamos as permissões (ex: ROLE_ADMIN),
                // assim não precisamos consultar o banco de novo para saber o perfil
                // do usuário em cada requisição futura.
                .claim("authorities", usuario.getAuthorities())

                // Data/hora em que o token foi emitido. Campo informativo,
                // não afeta a validação, mas é útil para auditoria/debug.
                .issuedAt(new Date(System.currentTimeMillis()))

                // Data/hora em que o token deixa de ser válido.
                // "agora" + o tempo de expiração configurado.
                // Importante por segurança: um token não pode durar para sempre.
                .expiration(new Date(System.currentTimeMillis() + expiration))

                // Assina o token com a chave secreta (SecretKey já indica o
                // algoritmo HMAC correto automaticamente a partir do tamanho
                // da chave, então não é mais preciso declarar SignatureAlgorithm).
                // É essa assinatura que impede alguém de editar o conteúdo do token
                // manualmente (ex: trocar o perfil para ADMIN) sem ser detectado —
                // qualquer alteração no conteúdo invalida a assinatura.
                .signWith(getSignInKey())

                // Finaliza a construção e gera a string final do token
                // (formato: cabecalho.corpo.assinatura).
                .compact();
    }

    // ------------------------------------------------------------------
    // EXTRAÇÃO DE DADOS DO TOKEN
    // Usado em requisições futuras, quando o cliente manda o token de
    // volta (no header Authorization) e precisamos saber quem ele é.
    // ------------------------------------------------------------------
    public String extrairLogin(String token) {
        // Claims::getSubject é uma "method reference" — equivalente a escrever
        // claims -> claims.getSubject(). Pegamos o "subject" que guardamos
        // lá em gerarToken (o login do usuário).
        return extrairClaim(token, Claims::getSubject);
    }

    // ------------------------------------------------------------------
    // VALIDAÇÃO DO TOKEN
    // Confirma que o token realmente pertence a esse usuário E que
    // ainda não expirou. Usado pelo filtro JWT em toda requisição
    // protegida (próximo passo do roteiro).
    // ------------------------------------------------------------------
    public boolean tokenValido(String token, UserDetails usuario) {
        String login = extrairLogin(token);
        return login.equals(usuario.getUsername()) && !tokenExpirado(token);
    }

    // Verifica se a data de expiração guardada no token já passou.
    private boolean tokenExpirado(String token) {
        return extrairClaim(token, Claims::getExpiration).before(new Date());
    }

    // Método genérico auxiliar: extrai qualquer "claim" do token,
    // usando uma função que diz qual claim específico pegar
    // (ex: Claims::getSubject, Claims::getExpiration).
    // O <T> permite reaproveitar esse método para extrair diferentes
    // tipos de dado (String, Date, etc) sem duplicar código.
    private <T> T extrairClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extrairTodasClaims(token);
        return resolver.apply(claims);
    }

    // Decodifica e valida a assinatura do token, devolvendo todo o
    // conteúdo (claims) de dentro dele. Se a assinatura não bater
    // (token adulterado ou chave errada), essa chamada lança exceção
    // automaticamente — é a biblioteca jjwt protegendo você aqui.
    //
    // NOTA DE VERSÃO: no jjwt 0.12.x+, "parserBuilder()" virou "parser()"
    // (já retorna o builder direto), "setSigningKey" virou "verifyWith",
    // e "parseClaimsJws" virou "parseSignedClaims". O resultado também
    // mudou de "getBody()" para "getPayload()".
    private Claims extrairTodasClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Transforma a string secreta (de application.properties) em uma
    // chave criptográfica utilizável pela biblioteca jjwt.
    // O tipo de retorno agora é SecretKey (mais específico que o antigo
    // Key), exigido pelos novos métodos verifyWith/signWith.
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}