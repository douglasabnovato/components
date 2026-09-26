import React from "react";

class ListItems extends React.Component {
  render() {
    const simpleStyle = {
      fontWeight: this.props.fontWeight || "bold",
    };
    return (
      <div>
        <ul>
          <li><span style={simpleStyle}>{this.props.item1}</span>{" "}{this.props.item1Description}</li>
          <li><span style={simpleStyle}>{this.props.item2}</span>{" "}{this.props.item2Description}</li>
          <li><span style={simpleStyle}>{this.props.item3}</span>{" "}{this.props.item3Description}</li>
        </ul>
      </div>
    );
  }
}

export default ListItems;
