    import { useEffect, useState } from 'react';
    import { useNavigate } from "react-router-dom";
    import axios from 'axios';
    import './RegistroEmpresa.css';

    const RegistroEmpresa = () => {
        const [nombre_empresa, setNombreEmpresa] = useState("");
        const [correo_empresa, setCorreoEmpresa] = useState("");
        const [nombre_representante, setNombreRepresentante] = useState("");
        const [telf_representante, setTelfRepresentante] = useState("");
        const [ID_docente, setIDDocente] = useState('');
        const [codigo, setCodigo] = useState("");
        const [logo_empresa, setLogoEmpresa] = useState("");
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(false);
        const [logoPreview, setLogoPreview] = useState(null);
        const [docentes, setDocentes] = useState([]);
        const [file, setFile] = useState(null);
        const navigate = useNavigate();

        const preset_name = "proyectoTIS";
        const cloud_name = "dlill8puk";

        // Generar código único
        useEffect(() => {
            const generateUniqueCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();
            setCodigo(generateUniqueCode());
        }, []);

        // Obtener lista de docentes
        useEffect(() => {
            axios.get('http://localhost:8000/api/v1/docentes')
                .then(response => {
                    if (response.data.success) {
                        setDocentes(response.data.data);
                    } else {
                        console.error("Failed to fetch docentes");
                    }
                })
                .catch(error => {
                    console.error("There was an error fetching the docentes!", error);
                });
        }, []);

        // Previsualización de imagen
        const handleFileChange = (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoPreview(reader.result);
                };
                reader.readAsDataURL(selectedFile);
                setFile(selectedFile); // Guardar el archivo para su subida
            }
        };

        // Manejo del envío del formulario
        const handleSubmit = async (e) => {
            e.preventDefault();
            setError(null);
            setSuccess(false);

            if (!file) {
                setError("Por favor, selecciona una imagen.");
                return;
            }
            if(telf_representante.length<8){
                setError("El número de la empresa es menor a 8 dígitos");
                return;
            }
            
            // Subir imagen a Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', preset_name);

            try {
                const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const uploadData = await uploadResponse.json();
                setLogoEmpresa(uploadData.secure_url);

                // Enviar datos al backend
                const response = await axios.post('http://localhost:8000/api/v1/grupo-empresa/register', {
                    nombre_empresa,
                    correo_empresa,
                    nombre_representante,
                    telf_representante,
                    ID_docente,
                    codigo,
                    logo_empresa: uploadData.secure_url,
                });

                if (response.data.success) {
                    setSuccess(true);
                    
                    console.log("Registro exitoso:", response.data.data);
                    navigate("/estudiante/info");
                    window.location.reload();
                } else {
                    setError("Ocurrió un error en el registro.");
                }
            } catch (err) {
                console.error("Error al registrar la empresa:", err);
                setError("Hubo un problema al registrar la empresa.");
            }
        };

        // Copiar código al portapapeles
        const copyToClipboard = (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(codigo)
                .then(() => alert('Código copiado al portapapeles!'))
                .catch(err => console.error('Error al copiar el código: ', err));
        };

        return (
            <section className="form-container">
                <div className="registro-container">
                    <h2>Registro de grupo-empresa</h2>
                    <form onSubmit={handleSubmit}>
                        <section className='form-register-empresa'>
                            <section className='colum-register'>
                                <div className="form-group">
                                    <label>Nombre de la empresa*</label>
                                    <input
                                        type="text"
                                        value={nombre_empresa}
                                        onChange={(e) => setNombreEmpresa(e.target.value)}
                                        placeholder='Ingresa el nombre'
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Correo electrónico de la empresa*</label>
                                    <input
                                        type="email"
                                        value={correo_empresa}
                                        onChange={(e) => setCorreoEmpresa(e.target.value)}
                                        placeholder='Ingresa el correo electrónico'
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Número representante legal*</label>
                                    <input
                                        type="text"
                                        value={telf_representante}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,8}$/.test(value)) {
                                                setTelfRepresentante(value);
                                            }
                                        }}
                                        placeholder="Ingresa el número del representante"
                                        required
                                    />
                                </div>
                                <div className="form-code">
                                    Código generado:
                                    <p>
                                        {codigo}
                                        <button onClick={copyToClipboard} className="copy-button">
                                            📋
                                        </button>
                                    </p>
                                </div>
                            </section>
                            <section className='colum-register'>
                                <div className="form-group">
                                    <label>Nombre representante legal*</label>
                                    <input
                                        type="text"
                                        value={nombre_representante}
                                        onChange={(e) => {
                                        const valor = e.target.value;
                                        // Permitir solo letras, espacios y caracteres específicos como acentos
                                        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor) && valor.length <= 30) {
                                            setNombreRepresentante(valor);
                                        }
                                        }}
                                        placeholder='Ingresa el nombre del representante'
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Docente TIS asignado</label>
                                    <select
                                        value={ID_docente}
                                        onChange={(e) => setIDDocente(e.target.value)}
                                        required
                                    >
                                        <option value="">Selecciona un Docente</option>
                                        {docentes.map(docente => (
                                            <option key={docente.ID_docente} value={docente.ID_docente}>
                                                {docente.nombre_usuario}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group image-container">
                                    <label>Logo de la empresa (subir imagen)</label>
                                    <div>
                                        {logoPreview && <img src={logoPreview} className="imagen-upload" alt="Vista previa del logo" />}
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png, image/gif"
                                            onChange={handleFileChange}
                                            className="upload"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>
                        </section>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">Registro exitoso!</p>}
                        <button type="submit" className="button">Registrar empresa</button>
                    </form>
                </div>
            </section>
        );
    };

    export default RegistroEmpresa;
