
# Plano: Formulario para Sugerir Nova Paroquia ou Pastoral

## Objetivo
Criar uma funcionalidade para usuarios sugerirem paroquias ou pastorais que nao estao cadastradas no sistema, fornecendo informacoes basicas como nome, endereco e telefone.

## Componentes a Criar

### 1. NewSuggestionModal.tsx
Modal com formulario para sugerir nova paroquia ou pastoral:

- **Tipo de sugestao**: Radio group com opcoes:
  - "Nova Paroquia" 
  - "Nova Pastoral"

- **Campos do formulario**:
  - Nome (obrigatorio)
  - Endereco (obrigatorio para paroquia, opcional para pastoral)
  - Telefone (opcional)
  - Observacoes adicionais (textarea opcional)

- **Validacao**: 
  - Nome obrigatorio com maximo 100 caracteres
  - Endereco obrigatorio para paroquias
  - Telefone com formato brasileiro

### 2. Hook useSubmitNewSuggestion
Novo hook (ou extensao do existente) para enviar sugestoes de novas entidades:
- Usa a tabela `suggestions` existente
- `suggestion_type`: "new_parish" ou "new_pastoral"
- `suggested_value`: JSON stringificado com os dados do formulario

## Integracao na Interface

### EmptyState.tsx
Adicionar botao "Nao encontrou sua paroquia?" no estado vazio para incentivar sugestoes.

### Footer.tsx
Adicionar link "Sugerir Paroquia/Pastoral" na secao "Para Paroquias".

### Index.tsx
- Importar o novo modal
- Gerenciar estado de abertura/fechamento
- Passar callback para EmptyState e Footer

## Fluxo do Usuario

```text
+------------------+     +-------------------+     +------------------+
|  Nao encontra    | --> |  Clica em         | --> |  Preenche form   |
|  sua paroquia    |     |  "Sugerir"        |     |  com dados       |
+------------------+     +-------------------+     +------------------+
                                                           |
                                                           v
                                               +------------------+
                                               |  Dados salvos    |
                                               |  em suggestions  |
                                               +------------------+
```

## Detalhes Tecnicos

### Estrutura do suggested_value (JSON)
```json
{
  "type": "new_parish" | "new_pastoral",
  "name": "Nome da Paroquia",
  "address": "Rua X, 123",
  "phone": "(43) 3XXX-XXXX",
  "notes": "Observacoes adicionais"
}
```

### Arquivos a Modificar
1. **Criar**: `src/components/NewSuggestionModal.tsx`
2. **Editar**: `src/hooks/useEvents.ts` - adicionar novo tipo de sugestao
3. **Editar**: `src/components/EmptyState.tsx` - adicionar botao de sugestao
4. **Editar**: `src/pages/Index.tsx` - gerenciar modal
5. **Editar**: `src/components/Footer.tsx` - adicionar link

### Nenhuma alteracao no banco de dados necessaria
A tabela `suggestions` ja suporta:
- `suggestion_type`: texto livre (adicionaremos "new_parish" e "new_pastoral")
- `suggested_value`: texto livre (usaremos JSON stringificado)
- `parish_id` e `event_id`: nullable (perfeito para sugestoes gerais)

## Validacao com Zod
```typescript
const newSuggestionSchema = z.object({
  type: z.enum(["new_parish", "new_pastoral"]),
  name: z.string().trim().min(1).max(100),
  address: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(500).optional(),
}).refine(
  data => data.type !== "new_parish" || (data.address && data.address.length > 0),
  { message: "Endereco obrigatorio para paroquias" }
);
```

## UX/UI
- Design consistente com SuggestionModal existente
- Icones: Church para paroquia, Users para pastoral
- Mensagem de sucesso via toast
- Campos com placeholders claros em portugues
