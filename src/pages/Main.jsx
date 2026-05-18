import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; 

function Main() {
    const [notes, setNotes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const API_URL = 'https://6a01fa240d92f63dd25323c7.mockapi.io/t/ad';

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) {
            navigate('/login');
        } else {
            setCurrentUser(session);
            fetchNotes(session);
        }
    }, [navigate]);
    const fetchNotes = async (username) => {
        try {
            const response = await axios.get(API_URL);
            if (response.status === 200) {
                const myNotes = response.data.filter(note => note.username === username);
                setNotes(myNotes);
            }
        } catch (error) { 
            console.error("Ошибка при получении данных с сервера:", error); 
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('session');
        navigate('/login');
    };

    
    const colors = {
        bg: "#fbf9f4",       
        primary: "#2e5b3f",  
        textDark: "#2c3e2e", 
        orange: "#e97a4d",   
        lightBg: "#f5f2eb",  
    };

    return (
        <div style={{ backgroundColor: colors.bg, minHeight: "100vh", fontFamily: "system-ui, sans-serif", paddingBottom: "60px" }}>
            
          
            <header className="bg-white shadow-sm mb-5" style={{ borderBottom: "1px solid #eae6df" }}>
                <div className="container-fluid d-flex justify-content-between align-items-center py-3 px-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div className="d-flex align-items-center gap-3">
                        <div style={{ backgroundColor: colors.primary, color: "#fff", width: "45px", height: "45px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "20px" }}>
                            У
                        </div>
                        <div>
                            <h3 className="m-0" style={{ fontWeight: "700", color: colors.primary, fontSize: "22px" }}>UniGrade</h3>
                            <small className="text-muted" style={{ fontSize: "12px" }}>Система управления успеваемостью</small>
                        </div>
                    </div>
                    
                  
                    {currentUser && (
                        <div className="d-flex align-items-center gap-3 bg-white p-2 px-3 border" style={{ borderRadius: "16px" }}>
                            <div style={{ backgroundColor: "#e8f0eb", color: colors.primary, width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px" }}>
                                {currentUser.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="text-start" style={{ lineHeight: "1.2" }}>
                                <div style={{ fontWeight: "600", fontSize: "14px", color: colors.textDark }}>{currentUser}</div>
                                <small className="text-muted" style={{ fontSize: "11px" }}>Студент • Группа CS-401</small>
                            </div>
                            <button onClick={handleLogout} className="btn btn-sm btn-link text-danger p-0 ms-2" style={{ fontSize: "13px", textDecoration: "none" }}>Выйти</button>
                        </div>
                    )}
                </div>
            </header>

            
            <div className="container px-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold m-0" style={{ color: colors.textDark }}>Личный кабинет студента</h2>
                        <p className="text-muted m-0">Здесь отображаются отправленные вами решения и задания.</p>
                    </div>
                    <Link to="/products" className="btn text-white px-4 rounded-pill fw-bold" style={{ backgroundColor: colors.primary, fontSize: "14px" }}>
                        Перейти к предметам →
                    </Link>
                </div>

              
                <div className="mb-4 mt-5">
                    <h5 className="mb-4" style={{ fontWeight: "700", color: colors.textDark, display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ width: "4px", height: "20px", background: colors.primary, borderRadius: "10px" }}></span>
                        История ваших ответов и решений
                    </h5>

                    {notes.length > 0 ? (
                        <div className="row g-4">
                            {notes.slice().reverse().map((item, index) => (
                                <div className="col-md-4" key={item.id || index}>
                               
                                    <div className="card h-100 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #eae6df", background: "#fff" }}>
                                 
                                        <div style={{ backgroundColor: colors.primary, padding: "24px 20px", color: "#fff", position: "relative" }}>
                                            <h5 className="m-0 text-truncate" style={{ fontWeight: "700", fontSize: "18px", paddingRight: "25px" }}>
                                                {item.heading || "Учебная дисциплина"}
                                            </h5>
                                            <span style={{ fontSize: "12px", opacity: "0.8", display: "block", marginTop: "4px" }}>
                                                📚 Проверка преподавателем
                                            </span>
                                            <span style={{ position: "absolute", top: "24px", right: "20px", color: "#f3cc7d", fontSize: "18px" }}>★</span>
                                        </div>

                                     
                                        <div className="card-body p-4 d-flex flex-column justify-content-between" style={{ minHeight: "200px" }}>
                                    
                                            <div className="mb-3">
                                                <span className="badge" style={{ backgroundColor: colors.bg, color: "#7c7569", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>
                                                    Лабораторная работа
                                                </span>
                                            </div>

                                           
                                            <div className="d-flex align-items-center gap-3 my-2">
                                              
                                                <div style={{ 
                                                    width: "56px", 
                                                    height: "56px", 
                                                    borderRadius: "50%", 
                                                    backgroundColor: "#fbeee7", 
                                                    color: colors.orange, 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center", 
                                                    fontWeight: "700", 
                                                    fontSize: "15px",
                                                    border: `1px solid ${colors.orange}`
                                                }}>
                                                    Проверка
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#a0988d", fontWeight: "700", letterSpacing: "0.5px" }}>Статус работы</div>
                                                    <div style={{ fontWeight: "700", color: "#4fa76c", fontSize: "15px" }}>
                                                        ✓ На проверке
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3" style={{ borderTop: "1px dashed #eae6df", fontSize: "13px" }}>
                                                <div className="mb-2">
                                                    <span className="text-muted d-block mb-1">📝 Ваш ответ:</span>
                                                    <div className="p-2 bg-light rounded text-dark fw-semibold" style={{ wordBreak: "break-word", fontSize: "12px" }}>
                                                        {item.description || "Решение не найдено"}
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between mt-2 pt-1" style={{ fontSize: "11px", color: "#a0988d" }}>
                                                    <span>📅 Дата: {item.date || "--.--.----"}</span>
                                                    <span>⏱ Время: {item.time || "--:--"}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-5 bg-white" style={{ borderRadius: "20px", border: "1px solid #eae6df" }}>
                            <p className="text-muted mb-0">Вы еще не отправили ни одного решения. Перейдите во вкладку предметов.</p>
                        </div>
                    )}
                </div>
                <footer className="text-center mt-5 pt-4" style={{ borderTop: "1px solid #eae6df", color: "#a0988d", fontSize: "12px" }}>
                    © 2026 UniGrade. Панель мониторинга успеваемости студента.
                </footer>

            </div>
        </div>
    );
}

export default Main;