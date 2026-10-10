# LenhaPro — instalar no telemóvel

## 1. Ficheiros no GitHub
Coloca estes ficheiros na raiz do repositório (substitui o `index.html` antigo):

```
index.html
manifest.json
sw.js
firestore.rules        (só para referência, não é usado pela app)
icons/
  icon-192.png
  icon-512.png
  icon-maskable-512.png
  apple-touch-icon.png
  favicon-32.png
```

## 2. Ativar o GitHub Pages
Repositório → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / pasta `/ (root)` → Save.
Ao fim de 1–2 minutos fica disponível em `https://<utilizador>.github.io/<repositório>/`.

## 3. Autorizar o domínio no Firebase (senão o login falha)
Firebase Console → **Authentication → Settings → Authorized domains → Add domain** → `<utilizador>.github.io`

## 4. Regras do Firebase (fazer logo a seguir a enviar os ficheiros)
Firebase Console → **Firestore Database → Regras** → cola o conteúdo de `firestore.rules` → **Publicar**.
- Protege os dados: só os dois emails autorizados conseguem ler e gravar.
- Permite a nova estrutura de dados (sem isto a app nova mostra "Sem permissão").
- Bloqueia gravações no documento antigo, para ninguém continuar a gravar com a versão velha.

## Nova estrutura dos dados
Cada encomenda, cliente, lote, gasto, dividendo e registo de horas é gravado em separado
(`producao/v2/...`). Se duas pessoas gravarem ao mesmo tempo, cada uma só altera o registo em que mexeu.
Na primeira vez que a app nova abrir, copia tudo do documento antigo automaticamente.
O documento antigo (`producao/dados_mestre`) fica intacto como cópia de segurança.

## 5. Instalar
- **Android (Chrome):** abre o link → botão verde **Instalar** na barra de cima (ou menu ⋮ → *Instalar aplicação*).
- **iPhone (Safari):** abre o link → botão Partilhar → **Adicionar ao ecrã principal**.

## Atualizações
Sempre que alterares a app, muda a linha `const VERSAO = 'lenhapro-v25';` no `sw.js` (v26, v27…)
para os telemóveis apanharem a versão nova. Fecha e volta a abrir a app.

## Sem rede
Os dados ficam guardados no telemóvel. Podes registar entregas e pagamentos sem rede;
sincronizam sozinhos quando voltar a ligação.
