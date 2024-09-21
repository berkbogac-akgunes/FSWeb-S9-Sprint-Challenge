import React, { useState } from "react";
import axios from "axios";

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
const [message, setMessage] = useState(initialMessage)
const [email, setEmail] = useState(initialEmail)
const [steps, setSteps] = useState(initialSteps)
const [index, setIndex] = useState(initialIndex)

  function getXY() {
    let coordinates = [(index % 3) + 1, Math.floor(index / 3) + 1]
    return coordinates
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
  }

  function getXYMesaj() {
    return `Koordinatlar (${getXY()[0]}, ${getXY()[1]})`;
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
  }

  function reset() {
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
    setMessage(initialMessage)
  }

  function sonrakiIndex(hedefIndex) {
    setIndex(hedefIndex)
    setSteps(steps + 1)
    setMessage(initialMessage)
  }

  function ilerle(event) {
    const yon = event.target.id
    switch(yon) {
      case "right":
        if(index % 3 === 2) {
          setMessage("Sağa gidemezsiniz")
        } else {
          sonrakiIndex(index + 1)
          
        }
        break;
      case "left":
        if(index % 3 === 0) {
          setMessage("Sola gidemezsiniz")
        } else {
          sonrakiIndex(index - 1)
        }
        break;
      case "up":
        if(index < 3) {
          setMessage("Yukarıya gidemezsiniz")
        } else {
          sonrakiIndex(index - 3)
        }
        break;
      case "down":
        if(index > 5) {
          setMessage("Aşağıya gidemezsiniz")
        } else {
          sonrakiIndex(index + 3)
        }
        break;
      case "reset":
        reset()
        break;

    }
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
  }

  function changeHandler(event) {
    setEmail(event.target.value)
    // inputun değerini güncellemek için bunu kullanabilirsiniz
  }

  function submitHandler(event) {
    event.preventDefault()
    axios.post("http://localhost:9000/api/result", {
      x: getXY()[0],
      y: getXY()[1],
      steps: steps,
      email: email,
    })
    .then((response) => {
      console.log(response)
      setMessage(response.data.message)
    })
    .catch((error) => {
      console.log(error)
      setMessage(error.response.data.message)
    })
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick = {ilerle} id="left">SOL</button>
        <button onClick = {ilerle} id="up">YUKARI</button>
        <button onClick = {ilerle} id="right">SAĞ</button>
        <button onClick = {ilerle} id="down">AŞAĞI</button>
        <button onClick = {ilerle} id="reset">reset</button>
      </div>
      <form onSubmit = {submitHandler}>
        <input value = {email} onChange = {changeHandler} id="email" type="email" placeholder="email girin"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
