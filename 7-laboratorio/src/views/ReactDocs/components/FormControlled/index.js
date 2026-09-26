import React from "react";

export default class FormControlled extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: "Jobs",
      fruta: "minha fruta",
      texto: "aloha",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    alert(this.state.nome + " gosta de " + this.state.fruta + " porque " + this.state.texto);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="nome"
            nome={this.state.nome}
            onChange={this.handleChange}
          />
        </label>
        <br />
        <label>
          Escolha seu sabor favorito:
          <select
            name="fruta"
            fruta={this.state.fruta}
            onChange={this.handleChange}
          >
            <option fruta="Laranja">Laranja</option>
            <option fruta="Limão">Limão</option>
            <option fruta="Coco">Coco</option>
            <option fruta="Manga">Manga</option>
          </select>
        </label>
        <br />
        <label>
          Explicação:
          <textarea name="texto" texto={this.state.texto} onChange={this.handleChange} />
        </label>
        <br />
        <input type="submit" value="Enviar" />
        <br />
        {this.state.nome}{" "}{this.state.fruta}{" "}{this.state.texto}
      </form>
    );
  }
}
