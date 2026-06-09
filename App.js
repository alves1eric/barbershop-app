import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

let DateTimePicker = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

const LOGO_URL = "https://img.myloview.com.br/fotomurais/barbershop-poster-banner-template-with-bearded-men-vector-illustration-700-228060080.jpg";
const BANNER_URL = "https://img.myloview.com.br/fotomurais/barbershop-poster-banner-template-with-bearded-men-vector-illustration-700-228060080.jpg";

export default function App() {
  const [telaAtual, setTelaAtual] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horaSelecionada, setHoraSelecionada] = useState(new Date());
  const [dataTemp, setDataTemp] = useState(new Date());
  const [horaTemp, setHoraTemp] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarRelogio, setMostrarRelogio] = useState(false);
  const [dataConfirmada, setDataConfirmada] = useState(false);
  const [horaConfirmada, setHoraConfirmada] = useState(false);
  const [dataWeb, setDataWeb] = useState("");
  const [horaWeb, setHoraWeb] = useState("");
  const [nomeCadastro, setNomeCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const servicos = [
    { nome: "Degradê", preco: 35, tempo: "40min" },
    { nome: "Social", preco: 30, tempo: "30min" },
    { nome: "Penteado", preco: 55, tempo: "30min" },
    { nome: "Barba", preco: 20, tempo: "" },
  ];

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const usuariosSalvos = await AsyncStorage.getItem('@barber_usuarios');
      const agendamentosSalvos = await AsyncStorage.getItem('@barber_agendamentos');
      if (usuariosSalvos) setUsuarios(JSON.parse(usuariosSalvos));
      if (agendamentosSalvos) setAgendamentos(JSON.parse(agendamentosSalvos));
    } catch (e) {
      console.log("Erro ao carregar:", e);
    }
  }

  async function salvarUsuarios(lista) {
    try {
      await AsyncStorage.setItem('@barber_usuarios', JSON.stringify(lista));
    } catch (e) {
      console.error("Erro ao salvar usuários:", e);
    }
  }

  async function salvarAgendamentos(lista) {
    try {
      await AsyncStorage.setItem('@barber_agendamentos', JSON.stringify(lista));
    } catch (e) {
      console.error("Erro ao salvar agendamentos:", e);
    }
  }

  function toggleServico(nomeServico) {
    setServicosSelecionados(prev => {
      if (prev.includes(nomeServico)) {
        return prev.filter(s => s !== nomeServico);
      } else {
        return [...prev, nomeServico];
      }
    });
  }

  function calcularTotal() {
    let total = 0;
    servicosSelecionados.forEach(nome => {
      const servico = servicos.find(s => s.nome === nome);
      if (servico) total += servico.preco;
    });
    return total;
  }

  async function cadastrarUsuario() {
    if (!nomeCadastro.trim() || !emailCadastro.trim() || !senhaCadastro || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }
    if (senhaCadastro !== confirmarSenha) {
      Alert.alert("Atenção", "As senhas não conferem!");
      return;
    }
    if (senhaCadastro.length < 4) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 4 caracteres!");
      return;
    }

    const emailExiste = usuarios.find(u => u.email === emailCadastro);
    if (emailExiste) {
      Alert.alert("Atenção", "Este e-mail já está cadastrado!");
      return;
    }

    const novoUsuario = {
      id: Date.now().toString(),
      nome: nomeCadastro,
      email: emailCadastro,
      senha: senhaCadastro
    };

    const novaLista = [...usuarios, novoUsuario];
    setUsuarios(novaLista);
    await salvarUsuarios(novaLista);

    Alert.alert("Sucesso!", "Conta criada com sucesso! Faça login.");
    setNomeCadastro("");
    setEmailCadastro("");
    setSenhaCadastro("");
    setConfirmarSenha("");
    setTelaAtual("login");
  }

  function fazerLogin() {
    if (!email.trim() || !senha) {
      Alert.alert("Atenção", "Preencha email e senha!");
      return;
    }

    const usuarioEncontrado = usuarios.find(
      u => u.email === email.trim() && u.senha === senha
    );

    if (usuarioEncontrado) {
      setUsuarioLogado(usuarioEncontrado);
      setEmail("");
      setSenha("");
      setTelaAtual("home");
    } else {
      Alert.alert("Erro", "E-mail ou senha inválidos!");
    }
  }

  function fazerLogout() {
    setUsuarioLogado(null);
    setAgendamentos([]);
    setTelaAtual("login");
  }

  function formatarData(data) {
    if (typeof data === 'string') return data;
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function formatarHora(data) {
    if (typeof data === 'string') return data;
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  function onChangeData(event, dataEscolhida) {
    if (Platform.OS === 'android') {
      setMostrarCalendario(false);
      if (event.type === 'set' && dataEscolhida) {
        setDataSelecionada(dataEscolhida);
        setDataConfirmada(true);
      }
    } else {
      if (dataEscolhida) setDataTemp(dataEscolhida);
    }
  }

  function confirmarData() {
    setDataSelecionada(dataTemp);
    setDataConfirmada(true);
    setMostrarCalendario(false);
  }

  function cancelarData() {
    setDataTemp(dataSelecionada);
    setMostrarCalendario(false);
  }

  function onChangeHora(event, horaEscolhida) {
    if (Platform.OS === 'android') {
      setMostrarRelogio(false);
      if (event.type === 'set' && horaEscolhida) {
        setHoraSelecionada(horaEscolhida);
        setHoraConfirmada(true);
      }
    } else {
      if (horaEscolhida) setHoraTemp(horaEscolhida);
    }
  }

  function confirmarHora() {
    setHoraSelecionada(horaTemp);
    setHoraConfirmada(true);
    setMostrarRelogio(false);
  }

  function cancelarHora() {
    setHoraTemp(horaSelecionada);
    setMostrarRelogio(false);
  }

  function onChangeDataWeb(texto) {
    setDataWeb(texto);
    if (texto.length === 10) setDataConfirmada(true);
  }

  function onChangeHoraWeb(texto) {
    setHoraWeb(texto);
    if (texto.length === 5) setHoraConfirmada(true);
  }

  async function confirmarAgendamento() {
    if (!nomeCliente.trim()) {
      Alert.alert("Atenção", "Preencha o nome!");
      return;
    }
    if (servicosSelecionados.length === 0) {
      Alert.alert("Atenção", "Escolha pelo menos um serviço!");
      return;
    }

    let dataHora;
    if (Platform.OS === 'web') {
      if (!dataWeb || !horaWeb) {
        Alert.alert("Atenção", "Selecione data e horário!");
        return;
      }
      dataHora = `${dataWeb} às ${horaWeb}`;
    } else {
      if (!dataConfirmada || !horaConfirmada) {
        Alert.alert("Atenção", "Selecione data e horário!");
        return;
      }
      dataHora = `${formatarData(dataSelecionada)} às ${formatarHora(horaSelecionada)}`;
    }

    const servicosTexto = servicosSelecionados.join(" + ");
    const total = calcularTotal();

    const novo = {
      id: Date.now(),
      nome: nomeCliente,
      servico: servicosTexto,
      data: dataHora,
      total: total,
      usuarioEmail: usuarioLogado?.email
    };

    const novaLista = [...agendamentos, novo];
    setAgendamentos(novaLista);
    await salvarAgendamentos(novaLista);

    Alert.alert("✅ Agendado!", `${nomeCliente}\n${servicosTexto}\n${dataHora}\nTotal: R$ ${total},00`);
    setNomeCliente("");
    setServicosSelecionados([]);
    setDataConfirmada(false);
    setHoraConfirmada(false);
    setDataWeb("");
    setHoraWeb("");
    setDataSelecionada(new Date());
    setHoraSelecionada(new Date());
    setTelaAtual("home");
    Keyboard.dismiss();
  }

  function renderizarSeletores() {
    if (Platform.OS === 'web') {
      return (
        <>
          <Text style={styles.label}>📅 Data:</Text>
          <TextInput style={styles.input} value={dataWeb} onChangeText={onChangeDataWeb} placeholder="DD/MM/AAAA" keyboardType="numbers-and-punctuation" maxLength={10} />
          <Text style={styles.dicaInput}>Formato: 25/12/2024</Text>

          <Text style={styles.label}>🕐 Horário:</Text>
          <TextInput style={styles.input} value={horaWeb} onChangeText={onChangeHoraWeb} placeholder="HH:MM" keyboardType="numbers-and-punctuation" maxLength={5} />
          <Text style={styles.dicaInput}>Formato: 14:30</Text>
        </>
      );
    }
    return (
      <>
        <Text style={styles.label}>📅 Data:</Text>
        <TouchableOpacity style={styles.dataHoraBtn} onPress={() => { setDataTemp(dataSelecionada); setMostrarCalendario(true); }}>
          <Ionicons name="calendar" size={20} color="#DAA520" />
          <Text style={styles.dataHoraTexto}>{dataConfirmada ? formatarData(dataSelecionada) : "Escolher data"}</Text>
        </TouchableOpacity>
        {mostrarCalendario && DateTimePicker && (
          <View style={styles.pickerContainer}>
            {Platform.OS === 'ios' && (
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={cancelarData}><Text style={styles.pickerCancelar}>Cancelar</Text></TouchableOpacity>
                <TouchableOpacity onPress={confirmarData}><Text style={styles.pickerOk}>OK</Text></TouchableOpacity>
              </View>
            )}
            <DateTimePicker value={dataTemp} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onChangeData} minimumDate={new Date()} locale="pt-BR" />
          </View>
        )}

        <Text style={styles.label}>🕐 Horário:</Text>
        <TouchableOpacity style={styles.dataHoraBtn} onPress={() => { setHoraTemp(horaSelecionada); setMostrarRelogio(true); }}>
          <Ionicons name="time" size={20} color="#DAA520" />
          <Text style={styles.dataHoraTexto}>{horaConfirmada ? formatarHora(horaSelecionada) : "Escolher horário"}</Text>
        </TouchableOpacity>
        {mostrarRelogio && DateTimePicker && (
          <View style={styles.pickerContainer}>
            {Platform.OS === 'ios' && (
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={cancelarHora}><Text style={styles.pickerCancelar}>Cancelar</Text></TouchableOpacity>
                <TouchableOpacity onPress={confirmarHora}><Text style={styles.pickerOk}>OK</Text></TouchableOpacity>
              </View>
            )}
            <DateTimePicker value={horaTemp} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onChangeHora} minuteInterval={30} locale="pt-BR" />
          </View>
        )}
      </>
    );
  }

  if (telaAtual === "login") {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <StatusBar barStyle="light-content" backgroundColor="#DAA520" />
        <ScrollView contentContainerStyle={styles.scrollLogin} keyboardShouldPersistTaps="handled">
          <View style={styles.loginBox}>
            <Image source={{ uri: LOGO_URL }} style={styles.logo} />
            <Text style={styles.barbeariaNome}>Barbershop</Text>
            <Text style={styles.subtitulo}>Faça login na sua conta</Text>

            <Text style={styles.label}>E-mail</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Digite seu e-mail" keyboardType="email-address" />

            <Text style={styles.label}>Senha</Text>
            <TextInput style={styles.input} value={senha} onChangeText={setSenha} placeholder="Digite sua senha" secureTextEntry={true} />

            <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
              <Text style={styles.textoBotao}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCadastro} onPress={() => setTelaAtual("cadastro")}>
              <Text style={styles.textoCadastro}>Não tem conta? Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (telaAtual === "cadastro") {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <StatusBar barStyle="light-content" backgroundColor="#DAA520" />
        <ScrollView contentContainerStyle={styles.scrollLogin} keyboardShouldPersistTaps="handled">
          <View style={styles.loginBox}>
            <Image source={{ uri: LOGO_URL }} style={styles.logo} />
            <Text style={styles.barbeariaNome}>Barbershop</Text>
            <Text style={styles.subtitulo}>Crie sua conta</Text>

            <Text style={styles.label}>Nome completo</Text>
            <TextInput style={styles.input} value={nomeCadastro} onChangeText={setNomeCadastro} placeholder="Digite seu nome" />

            <Text style={styles.label}>E-mail</Text>
            <TextInput style={styles.input} value={emailCadastro} onChangeText={setEmailCadastro} placeholder="Digite seu e-mail" keyboardType="email-address" />

            <Text style={styles.label}>Senha</Text>
            <TextInput style={styles.input} value={senhaCadastro} onChangeText={setSenhaCadastro} placeholder="Mínimo 4 caracteres" secureTextEntry={true} />

            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} placeholder="Repita a senha" secureTextEntry={true} />

            <TouchableOpacity style={styles.botao} onPress={cadastrarUsuario}>
              <Text style={styles.textoBotao}>Criar Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoVoltarLogin} onPress={() => setTelaAtual("login")}>
              <Ionicons name="arrow-back" size={18} color="#DAA520" />
              <Text style={styles.textoVoltarLogin}>Já tem conta? Faça login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (telaAtual === "home") {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#DAA520" />
        <View style={styles.header}>
          <TouchableOpacity onPress={fazerLogout} style={styles.btnVoltar}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
            <Text style={styles.btnVoltarTexto}>Sair</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Barbershop</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.content}>
          {usuarioLogado && (
            <Text style={styles.boasVindas}>👋 Olá, {usuarioLogado.nome}!</Text>
          )}
          <Image source={{ uri: BANNER_URL }} style={styles.banner} />
          <Text style={styles.saudacao}>Pronto para agendar seu próximo serviço?</Text>

          <TouchableOpacity style={styles.botao} onPress={() => setTelaAtual("agendamento")}>
            <Text style={styles.textoBotao}>Começar Agendamento</Text>
          </TouchableOpacity>

          {agendamentos.length > 0 && (
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>Seus Agendamentos:</Text>
              {agendamentos.map((item) => (
                <View key={item.id} style={styles.cardAgendamento}>
                  <Text style={styles.cardTexto}>👤 {item.nome}</Text>
                  <Text style={styles.cardTexto}>💈 {item.servico}</Text>
                  <Text style={styles.cardTexto}>📅 {item.data}</Text>
                  <Text style={styles.cardPreco}>💰 R$ {item.total},00</Text>
                </View>
              ))}
            </View>
          )}

          {agendamentos.length === 0 && (
            <Text style={styles.semAgendamentos}>Nenhum agendamento ainda 📭</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerTexto}>📍 Rua Cohab, 5 - Carapicuíba, SP</Text>
        </View>
      </View>
    );
  }

  if (telaAtual === "agendamento") {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <StatusBar barStyle="light-content" backgroundColor="#DAA520" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setTelaAtual("home")} style={styles.btnVoltar}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
            <Text style={styles.btnVoltarTexto}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendamento</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.secaoTitulo}>Escolha um ou mais serviços:</Text>
          <Text style={styles.dica}>Toque para selecionar/desselecionar</Text>

          {servicos.map((servico) => {
            const selecionado = servicosSelecionados.includes(servico.nome);
            return (
              <TouchableOpacity key={servico.nome} style={[styles.servicoCard, selecionado && styles.servicoSelecionado]} onPress={() => toggleServico(servico.nome)}>
                <View style={styles.servicoLinha}>
                  <View style={styles.checkbox}>
                    {selecionado ? <Ionicons name="checkbox" size={22} color="#DAA520" /> : <Ionicons name="square-outline" size={22} color="#666" />}
                  </View>
                  <View style={styles.servicoInfo}>
                    <Text style={styles.servicoNome}>{servico.nome}</Text>
                    <Text style={styles.servicoPreco}>R$ {servico.preco},00{servico.tempo !== "" ? ` - ${servico.tempo}` : ""}</Text>
                  </View>
                  {selecionado && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />}
                </View>
              </TouchableOpacity>
            );
          })}

          {servicosSelecionados.length > 0 && (
            <View style={styles.resumo}>
              <Text style={styles.resumoTitulo}>✅ Serviços selecionados:</Text>
              {servicosSelecionados.map(nome => <Text key={nome} style={styles.resumoItem}>• {nome}</Text>)}
              <View style={styles.linhaTotal}>
                <Text style={styles.totalTexto}>Total:</Text>
                <Text style={styles.totalPreco}>R$ {calcularTotal()},00</Text>
              </View>
            </View>
          )}

          <Text style={styles.label}>Nome do cliente:</Text>
          <TextInput style={styles.input} value={nomeCliente} onChangeText={setNomeCliente} placeholder="Nome completo" />
          {renderizarSeletores()}

          <TouchableOpacity style={styles.botao} onPress={confirmarAgendamento}>
            <Text style={styles.textoBotao}>Confirmar Agendamento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoHome} onPress={() => setTelaAtual("home")}>
            <Ionicons name="home" size={18} color="#DAA520" />
            <Text style={styles.textoHome}>Voltar para Home</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return null;
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  scrollLogin: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 50,
  },

  loginBox: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },

  barbeariaNome: {
    fontSize: 24,
    fontWeight: "700",
    color: "#DAA520",
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 14,
    color: "#AAA",
    marginBottom: 24,
  },

  label: {
    color: "#FFF",
    alignSelf: "flex-start",
    marginBottom: 6,
    marginTop: 12,
    fontWeight: "600",
  },

  input: {
    width: "100%",
    backgroundColor: "#2A2A2A",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },

  dicaInput: {
    color: "#888",
    fontSize: 11,
    marginTop: 4,
    marginBottom: 4,
  },

  botao: {
    backgroundColor: "#DAA520",
    width: "100%",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },

  textoBotao: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  botaoCadastro: {
    marginTop: 16,
    padding: 8,
  },

  textoCadastro: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "600",
  },

  botaoVoltarLogin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },

  textoVoltarLogin: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "600",
  },

  header: {
    backgroundColor: "#DAA520",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 55 : 35,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },

  btnVoltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  btnVoltarTexto: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    flex: 1,
    padding: 16,
  },

  boasVindas: {
    color: "#DAA520",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  banner: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },

  saudacao: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
  },

  semAgendamentos: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
    marginTop: 30,
  },

  dica: {
    color: "#888",
    fontSize: 12,
    marginBottom: 10,
    fontStyle: "italic",
  },

  secao: {
    marginTop: 30,
  },

  secaoTitulo: {
    color: "#DAA520",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  cardAgendamento: {
    backgroundColor: "#1E1E1E",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#DAA520",
  },

  cardTexto: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 3,
  },

  cardPreco: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  servicoCard: {
    backgroundColor: "#1E1E1E",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },

  servicoSelecionado: {
    borderColor: "#DAA520",
    borderWidth: 2,
    backgroundColor: "#2A2010",
  },

  servicoLinha: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    marginRight: 12,
  },

  servicoInfo: {
    flex: 1,
  },

  servicoNome: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  servicoPreco: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  resumo: {
    backgroundColor: "#1E1E1E",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DAA520",
  },

  resumoTitulo: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  resumoItem: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 2,
  },

  linhaTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },

  totalTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  totalPreco: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "700",
  },

  dataHoraBtn: {
    width: "100%",
    backgroundColor: "#2A2A2A",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dataHoraTexto: {
    color: "#AAA",
    fontSize: 14,
    marginLeft: 8,
  },

  pickerContainer: {
    marginTop: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 10,
  },

  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  pickerCancelar: {
    color: "#FF5252",
    fontSize: 16,
    fontWeight: "600",
  },

  pickerOk: {
    color: "#DAA520",
    fontSize: 16,
    fontWeight: "700",
  },

  botaoHome: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#DAA520",
  },

  textoHome: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    backgroundColor: "#1E1E1E",
    padding: 14,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },

  footerTexto: {
    color: "#AAA",
    fontSize: 13,
  },

});