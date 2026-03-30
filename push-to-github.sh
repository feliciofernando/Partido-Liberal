#!/bin/bash
# Script para fazer push para o GitHub
# Execute: ./push-to-github.sh SEU_TOKEN

TOKEN=$1

if [ -z "$TOKEN" ]; then
    echo "Uso: ./push-to-github.sh SEU_GITHUB_TOKEN"
    echo ""
    echo "Para criar um token:"
    echo "1. Acesse https://github.com/settings/tokens"
    echo "2. Clique em 'Generate new token (classic)'"
    echo "3. Selecione 'repo' como escopo"
    echo "4. Copie o token gerado"
    exit 1
fi

cd /home/z/my-project

# Configurar remote com token
git remote set-url origin https://feliciofernando:$TOKEN@github.com/feliciofernando/Partido-Liberal.git

# Adicionar e commitar
git add -A
git commit -m "Atualização: Correções de estabilidade e melhorias"

# Push
git push -u origin master

echo "Push concluído!"
