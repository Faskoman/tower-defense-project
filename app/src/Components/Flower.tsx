import "../styles/Flower.scss"

function Flower() {
    return (
      <div className="flower">
        <div className="flower__bud">
          <div className="flower__bud__head"></div>
          <div className="flower__bud__petals"></div>
          <div className="flower__bud__petals"></div>
          <div className="flower__bud__petals"></div>
        </div>
        <div className="flower__stem"></div>
        <div className="flower__leaves">
          <div className="flower__leaves__leaf"></div>
          <div className="flower__leaves__leaf"></div>
        </div>
      </div>
    );
  }

  export default Flower;