import { useState } from "react";

function Card({ name, type, attack }) {
  const [likes, setLikes] = useState(0);

  return (
    <li>
      <b>{name}</b> — {type}, ataque {attack}
      {attack >= 6 && <span className="strong">forte</span>}{" "}
      <button onClick={() => setLikes(likes + 1)}>♥ {likes}</button>
    </li>
  );
}

export default Card;
