import Card from "./components/Card/index";
import Description from "./components/Description/index";
import RedesSociais from "./components/RedesSociais/index";
import Stateful from "./components/Stateful/index";
import Todolist from "./components/Todolist/index";
import Converter from "./components/Converter/index";
import LikeButton from "./components/LikeButton/index";
import Toolchains from "./components/Toolchains";
import ListItems from "./components/ListItems";
import FormatName from "./components/FormatName";
import Clock from "./components/Clock";
import Details from "./components/Details";
import Toggle from "./components/Toggle";
import LoginControl from "./components/LoginControl";
import KeyLists from "./components/KeysLists";
import FormControlled from "./components/FormControlled";
import TemperatureCalculator from "./components/TemperatureCalculator";
import Message from "./components/Message";
import MockUp from "./components/MockUp"; 

function ReactDocs() {
  return (
    <div className="App">
      <h1>Documentação - Instalação + Principais Conceitos</h1>
      <main className="App-Main">
        <div className="Cards">
          <Card titulo="#17 - MockUp" color="#3498DB">
            <Details
              titulo="React "
              detalhes="o principal modo de se construir aplicações Web grandes e rápidas com JavaScript. Nesse Mock nós iremos ensinar o processo mental envolvido na construção de uma tabela de produtos buscáveis utilizando o React."
            />
            <MockUp />
          </Card>
          <Card titulo="#16 - Message" color="#F4D03F">
            <Details
              titulo="Componsição "
              detalhes="ao invés de herança para reutilizar código entre componentes."
            />
            <Details
              titulo="Prop children"
              detalhes=" é recomendada para esses componentes para passar os elementos filhos diretos para sua respectiva saída."
            />
            <Message />
          </Card>
          <Card titulo="#15 - Elevar state" color="#CD6155">
            <Details
              titulo="Elevar state "
              detalhes=" m dado tem que ser refletida em vários componentes. Recomendamos elevar o state compartilhado ao elemento pai comum mais próximo. "
            />
            <TemperatureCalculator celsius={135} />
          </Card>
          <Card titulo="#14 - Formulário" color="#566573">
            <Details
              titulo="Formulário "
              detalhes="com componentes controlado e múltiplos inputs é muito importante seu comportamento."
            />
            <FormControlled />
          </Card>
          <Card titulo="#13 - Listas e Chaves" color="#AF7AC5">
            <KeyLists numbers={[1, 2, 3, 4, 5, 6]} />
            <Details
              titulo="Listas "
              detalhes="listas de componentes exibidos dinamicamente com o método map"
            />
            <Details
              titulo="Key "
              detalhes="Quando você não possui nenhum ID estável para os itens renderizados, podemos usar o index do item como chave em último recurso."
            />
          </Card>
          <Card titulo="#12 - Renderização condicional" color="#5499C7">
            <Details
              titulo="Lógica de componentes passando por parâmetro "
              detalhes="Criar elementos representando o estado atual, e deixe o React atualizar a UI para corresponde-los.."
            />
            <LoginControl isLoggedIn={true} />
          </Card>
          <Card titulo="#11 - Manipulando Eventos" color="#0E6251">
            <Details
              titulo="this: "
              detalhes="Se você esquecer de fazer o bind de this.handleClick e passá-lo para um onClick, o this será undefined quando a função for realmente chamada."
            />
            <Details
              titulo="method: "
              detalhes="Se você referir a um método sem () depois dele, como onClick={this.handleClick}, você deve fazer o bind manual deste método."
            />
            <Details
              titulo="styled-components: "
              detalhes="estilização do botão."
            />
            <Toggle />
          </Card>
          <Card titulo="#10 - Componentes e Props" color="#A6ACAF">
            <Details
              titulo="Components"
              detalhes="Permitem dividir a UI em partes independentes, reutilizáveis e pensar em cada parte isoladamente."
            />
            <Details
              titulo="Props"
              detalhes="são somente leitura. Um componente como uma função ou uma classe, nunca deve modificar seus próprios props."
            />
          </Card>
          <Card titulo="#09 - Renderizando um Elemento no DOM" color="#17A589">
            <Description description="Timer" fontWeight="900" />
            <Clock />
          </Card>
          <Card titulo="#08 - Formatar Nomes" color="#C0392B">
            <Description description="Introduzir JSX" fontWeight="900" />
            <FormatName />
          </Card>
          <Card titulo="#07 - Inicializar Projeto React" color="#F39C12">
            <Toolchains title="create react app" />
            <ListItems
              item1="npx create-react-app my-app"
              item2="cd my-app"
              item3="npm start"
              item1Description="criar o projeto com a estrutura inicial"
              item2Description="entrar na pasta do projeto criada"
              item3Description="iniciar o projeto"
              fontWeight="900"
            />
          </Card>
          <Card titulo="#06 - Toolchains" color="#F1C40F">
            <Toolchains title="Ferramentas" />
            <ListItems
              item1="create react app"
              item2="next.js"
              item3="gatsby"
              item1Description="para criar um site SPA"
              item2Description="para criar um site renderizado no servidor (ssr)"
              item3Description="para site estático orientado a conteúdo"
              fontWeight="900"
            />
          </Card>
          <Card titulo="#05 - Like Buttons" color="#921388">
            <Description description="Um botão de likes" fontWeight="900" />
            <LikeButton />
          </Card>
          <Card titulo="#04 - Plugins" color="#2980B9">
            <Description
              description="biblioteca de markdown"
              fontWeight="900"
            />
            <Converter />
          </Card>
          <Card titulo="#03 - To Do List" color="#229954">
            <Description description="event delegation" fontWeight="900" />
            <Todolist />
          </Card>
          <Card titulo="#02 - Cronômetro" color="#E74C3C">
            <Description description="componente com estado" fontWeight="900" />
            <Stateful />
          </Card>
          <Card titulo="#01 - Redes Sociais" color="#8A2BE2">
            <Description description="componente simples" fontWeight="900" />
            <RedesSociais name="douglasabnovato" />
          </Card>
        </div>
      </main>
    </div>
  );
}

export default ReactDocs;
