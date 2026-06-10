# 💈 Barbershop - App de Agendamento

Aplicativo mobile desenvolvido em **React Native** para agendamento de serviços em barbearia. Projeto acadêmico apresentado à disciplina de Desenvolvimento Mobile.

---

## 📱 Funcionalidades

- 🔐 **Cadastro e Login** de usuários com validação
- ✂️ **Seleção de serviços** com checkbox (múltipla escolha)
  - Degradê - R$ 35,00 (40min)
  - Social - R$ 30,00 (30min)
  - Penteado - R$ 55,00 (30min)
  - Barba - R$ 20,00
- 📅 **Agendamento** com data e horário (calendário nativo)
- 💰 **Cálculo automático** do valor total dos serviços
- 📋 **Histórico** de agendamentos salvos
- 💾 **Persistência de dados** com AsyncStorage
- 📱 Funciona em **Android, iOS e Web**

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| React Native | Framework principal |
| Expo | Plataforma de desenvolvimento |
| AsyncStorage | Armazenamento local de dados |
| DateTimePicker | Calendário e relógio nativos |
| Ionicons | Biblioteca de ícones |
| React Native Paper | Componentes visuais |
| JavaScript (ES6+) | Linguagem de programação |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js instalado
- Expo CLI
- Expo Go (no celular)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/alves1eric/barbershop-app.git

# Entre na pasta
cd barbershop-app

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
