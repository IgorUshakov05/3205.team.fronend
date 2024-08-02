import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import InputMask from "react-input-mask";

function App() {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNumberValid, setIsNumberValid] = useState(false);

  // Валидация электронной почты
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Валидация номера
  const validateNumber = (number) => {
    const numberPattern = /^\d{2}-\d{2}-\d{2}$/; // Ожидается формат 99-99-99
    return numberPattern.test(number);
  };

  // Функция для обновления состояния валидации
  const updateValidation = () => {
    setIsEmailValid(validateEmail(email));
    setIsNumberValid(validateNumber(number));
  };

  useEffect(() => {
    updateValidation();
  }, [email, number]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/search", {
        email,
        number: number.replace(/-/g, ""), // Убираем дефисы перед отправкой на сервер
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Форма</h2>
      <form onSubmit={handleSubmit}>
        <label>Электронная почта:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          name="email"
          placeholder="Введите вашу почту"
          required
        />

        <label>Номер:</label>
        <InputMask
          mask="99-99-99"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          id="phone"
          name="phone"
          placeholder="Введите ваш номер телефона"
        >
          {(inputProps) => <input {...inputProps} type="text" />}
        </InputMask>

        <button
          type="submit"
          disabled={loading || !isEmailValid || (!isNumberValid)}
        >
          {loading ? "Поиск..." : "Отправить"}
        </button>
      </form>

      {users.length > 0 && (
        <div className="results">
          <h3>Результаты поиска:</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                Email: {user.email}, Number: {user.number}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
