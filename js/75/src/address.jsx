import './address.css';

export default function Address({ street, city, state, zip }) {
    // const { street, city, state, zip } = props;
    const style = {
        color: "blue",
        fontSize: "20px",
        fontFamily: "cursive"
    }
    return (

        <div className="address">
            <div style={style}> {street}</div>
            <span>{city}, </span><span>{state}</span>
            <div style={{ backgroundColor: "lightgray", padding: "10px" }}>{zip}</div>
        </div>



    )

}