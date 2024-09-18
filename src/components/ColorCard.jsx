//los botones
export default function ColorCard({color, onClick, light}){
    return(
          <button onClick={onClick} className={`game-buttons ${color} ${light ? "light" : ""}`}>
          </button>
    );
}