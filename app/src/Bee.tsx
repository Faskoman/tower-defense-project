import "./Bee.scss"

function Bee() {
  return (
    <div className="centered-flex">
      <div className="bee">
        <div className="bee__body">
          <div>
            <div className="bee__body__stripes"></div>
            <div className="bee__body__stripes"></div>
            <div className="bee__body__stripes"></div>
          </div>
        </div>
        <div>
          <div className="bee__eyes --right-eye"></div>
          <div className="bee__eyes --left-eye"></div>
        </div>
        <div className="bee__wings">
          <div className="bee__wings__wing"></div>
          <div className="bee__wings__wing"></div>
        </div>
        <div>
          <div className="bee__antena"></div>
          <div className="bee__antena"></div>
        </div>
      </div>
    </div>
  );
}

export default Bee;
