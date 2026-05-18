import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { products, categories } from "../data/products";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
    const [subjectList, setSubjectList] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(0);
    const [currentUser, setCurrentUser] = useState(null); 
    const navigate = useNavigate();

    
    const [solutions, setSolutions] = useState({});

    const API_URL = 'https://6a01fa240d92f63dd25323c7.mockapi.io/t/ad';

    useEffect(() => {
        setSubjectList(products);
        const session = localStorage.getItem('session');
        if (session) {
            setCurrentUser(session);
        } else {
            
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('session');
        setCurrentUser(null);
        navigate('/login');
    };

    const handleTextChange = (subjectId, field, value) => {
        setSolutions(prev => ({
            ...prev,
            [subjectId]: {
                ...prev[subjectId],
                [field]: value
            }
        }));
    };

    
    const handleSubmitSolution = async (e, subjectId, subjectName) => {
        e.preventDefault();
        const subjectData = solutions[subjectId];
        
        if (!subjectData?.studentName) {
            return alert("Пожалуйста, введите ваше Имя и Фамилию!");
        }
        if (!subjectData?.solutionText) {
            return alert("Заполните поле с решением задачи!");
        }

        try {
           
            const response = await axios.post(API_URL, {
                username: currentUser, 
                heading: subjectName, 
                description: `Студент: ${subjectData.studentName}. Решение: ${subjectData.solutionText}. Комментарий: ${subjectData.commentText || 'Нет'}`,
                date: new Date().toLocaleDateString('ru-RU'),
                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
            });

            if (response.status === 201 || response.status === 200) {
                alert(`Успешно! Решение по предмету "${subjectName}" отправлено на проверку.`);
                
             
                setSolutions(prev => ({
                    ...prev,
                    [subjectId]: { studentName: '', solutionText: '', commentText: '' }
                }));
                
                navigate('/main');
            }
        } catch (error) {
            console.error("Ошибка сохранения на сервере:", error);
            alert("Произошла ошибка при отправке. Проверьте сеть.");
        }
    };

    const filteredSubjects = selectedSemester === 0 
        ? subjectList 
        : subjectList.filter(p => p.category_id === selectedSemester);

    const colors = {
        bg: "#fbf9f4",       
        primary: "#2e5b3f",  
        textDark: "#2c3e2e", 
        orange: "#e97a4d"
    };

    return (
        <div style={{ backgroundColor: colors.bg, minHeight: "100vh", fontFamily: "system-ui, sans-serif", paddingBottom: "60px" }}>
            
           
            <nav className="navbar navbar-expand-lg bg-white shadow-sm mb-5" style={{ borderBottom: "1px solid #eae6df" }}>
                <div className="container-fluid" style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <Link to="/main" className="navbar-brand d-flex align-items-center gap-3 text-decoration-none">
                        <div style={{ backgroundColor: colors.primary, color: "#fff", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                            У
                        </div>
                        <span className="fs-4 fw-bold" style={{ color: colors.primary }}>UniGrade</span>
                    </Link>
                    
                    <div className="d-flex align-items-center gap-4">
                        <Link to="/main" className="text-decoration-none text-secondary small fw-bold">Мой кабинет</Link>
                        {currentUser && (
                            <div className="d-flex align-items-center gap-2 border-start ps-3">
                                <span className="small text-muted">👤 {currentUser}</span>
                                <button onClick={handleLogout} className="btn btn-sm btn-link text-danger text-decoration-none p-0 ms-2">Выйти</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="mb-4">
                    <h1 className="fw-bold" style={{ color: colors.textDark }}>Доступные дисциплины</h1>
                    <p className="text-muted">Выберите предмет, укажите ваши данные и отправьте выполненную задачу.</p>
                </div>

             
                <div className="d-flex gap-2 mb-5 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    <button 
                        className={`btn rounded-pill px-4 ${selectedSemester === 0 ? 'btn-dark' : 'btn-white border'}`}
                        style={{ backgroundColor: selectedSemester === 0 ? colors.primary : '#fff' }}
                        onClick={() => setSelectedSemester(0)}
                    >
                        Все семестры
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`btn rounded-pill px-4 ${selectedSemester === cat.id ? 'btn-dark' : 'btn-white border'}`}
                            style={{ backgroundColor: selectedSemester === cat.id ? colors.primary : '#fff' }}
                            onClick={() => setSelectedSemester(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

               
                <div className="row g-4">
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((item) => (
                            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                                <div className="card h-100 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #eae6df", background: "#fff" }}>
                                    
                                    <div style={{ backgroundColor: colors.primary, padding: "20px", color: "#fff" }}>
                                        <h5 className="m-0 text-truncate" style={{ fontWeight: "700" }}>{item.name}</h5>
                                        <small className="opacity-75">📋 Проверочный бланк контроля</small>
                                    </div>

                                    <div className="card-body p-4">
                                        <div className="mb-3">
                                            <span className="badge bg-light text-dark border">Семестр {item.category_id || 7}</span>
                                        </div>
                                        
                                        <p className="text-muted small mb-4">{item.description}</p>
                                        
                                        <form onSubmit={(e) => handleSubmitSolution(e, item.id, item.name)}>
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-muted">ВАШЕ ИМЯ И ФАМИЛИЯ</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Пример: Петр Иванов"
                                                    style={{ borderRadius: '10px', backgroundColor: '#fdfbf7' }}
                                                    value={solutions[item.id]?.studentName || ''}
                                                    onChange={(e) => handleTextChange(item.id, 'studentName', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-muted">РЕШЕНИЕ ЗАДАЧИ</label>
                                                <textarea 
                                                    rows="2" 
                                                    className="form-control" 
                                                    placeholder="Впишите ответ (например: 1 + 1 = 2)..."
                                                    style={{ borderRadius: '10px', backgroundColor: '#fdfbf7' }}
                                                    value={solutions[item.id]?.solutionText || ''}
                                                    onChange={(e) => handleTextChange(item.id, 'solutionText', e.target.value)}
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-muted">КОММЕНТАРИЙ</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Любые примечания к решению..."
                                                    style={{ borderRadius: '10px', backgroundColor: '#fdfbf7' }}
                                                    value={solutions[item.id]?.commentText || ''}
                                                    onChange={(e) => handleTextChange(item.id, 'commentText', e.target.value)}
                                                />
                                            </div>

                                            <button type="submit" className="btn text-white w-100 fw-bold mt-2" style={{ backgroundColor: colors.orange, borderRadius: '12px' }}>
                                                Отправить решение ➔
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">Нет предметов в выбранном семестре.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;