# Page snapshot

```yaml
- main [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - link "Kaddesh" [ref=e7] [cursor=pointer]:
        - /url: /
        - heading "Kaddesh" [level=1] [ref=e8]
      - heading "Entre na sua conta" [level=2] [ref=e9]
      - paragraph [ref=e10]:
        - text: Ou
        - link "crie uma nova conta" [ref=e11] [cursor=pointer]:
          - /url: /register
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: Email
        - textbox "Email" [ref=e18]:
          - /placeholder: seu@email.com
          - text: teste.1764176457923@kadesh.com
      - generic [ref=e19]:
        - generic [ref=e20]: Senha
        - generic [ref=e21]:
          - textbox "Senha" [ref=e22]:
            - /placeholder: ••••••••
            - text: senha123456
          - button [ref=e23] [cursor=pointer]:
            - img [ref=e24]
      - generic [ref=e27]:
        - generic [ref=e28]:
          - checkbox "Lembrar-me" [ref=e29]
          - generic [ref=e30]: Lembrar-me
        - link "Esqueceu a senha?" [ref=e32] [cursor=pointer]:
          - /url: "#"
      - generic [ref=e34]:
        - img [ref=e36]
        - paragraph [ref=e39]: Erro ao fazer login
      - button "Entrar" [ref=e41] [cursor=pointer]
```