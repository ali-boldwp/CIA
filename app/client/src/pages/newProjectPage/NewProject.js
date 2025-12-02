import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    useGetProjectRequestByIdQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,

} from "../../services/projectApi";
import { useGetAnalystsQuery } from "../../services/userApi";
import "./NewProjectstyle.css";
import {toast} from "react-toastify";

const NewProject = () => {

    const { id } = useParams();

    // LOAD ANALYSTS
    const { data: analystsData } = useGetAnalystsQuery();

    const analysts = Array.isArray(analystsData)
        ? analystsData
        : Array.isArray(analystsData?.data)
            ? analystsData.data
            : Array.isArray(analystsData?.users)
                ? analystsData.users
                : Array.isArray(analystsData?.analysts)
                    ? analystsData.analysts
                    : [];

    const analystOptions = analysts.map(a => ({ id: a._id, name: a.name }));


    // LOAD REQUEST BY ID
    const { data, isLoading } = useGetProjectRequestByIdQuery(id, {
        skip: !id,
    });

    const request = data?.data;

    // ============================
    // FORM STATES
    // ============================
    const [projectName, setProjectName] = useState("");
    const [projectSubject, setProjectSubject] = useState("");
    const [reportType, setReportType] = useState("");
    const [entityType, setEntityType] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setPriority] = useState("");
    const [language, setLanguage] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    const [clientName, setClientName] = useState("");
    const [clientPerson, setClientPerson] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientPosition, setClientPosition] = useState("");

    const [contractNo, setContractNo] = useState("");
    const [annexNo, setAnnexNo] = useState("");
    const [services, setServices] = useState("");
    const [projectPrice, setProjectPrice] = useState("");

    const [contractInfo, setContractInfo] = useState("");
    const [referenceRequest, setReferenceRequest] = useState("");
    const [internalNotes, setInternalNotes] = useState("");

    const [files, setFiles] = useState([]);

    const [respOpen, setRespOpen] = useState(false);
    const [responsible, setResponsible] = useState("Selectează responsabilul");

    const [multiOpen, setMultiOpen] = useState(false);
    const [selectedAnalysts, setSelectedAnalysts] = useState([]);

    const respRef = useRef(null);
    const multiRef = useRef(null);

    // ============================
    // AUTOFILL from Request
    // ============================

    useEffect(() => {
        if (request && id) {
            setProjectName(request.projectName || "");
            setProjectSubject(request.projectSubject || "");
            setReportType(request.reportType || "");
            setEntityType(request.entityType || "");
            setDeadline(request.deadline?.substring(0, 10) || "");
            setPriority(request.priority || "");
            setLanguage(request.deliverableLanguage || "");
            setProjectDescription(request.projectDescription || "");

            setClientName(request.clientName || "");
            setClientPerson(request.clientContactPerson || "");
            setClientEmail(request.clientEmail || "");
            setClientPhone(request.clientPhone || "");
            setClientPosition(request.clientPosition || "");

            setContractNo(request.contractNumber || "");
            setAnnexNo(request.annexNumber || "");
            setServices(request.servicesRequested?.join(", ") || "");
            setProjectPrice(request.projectPrice || "");

            setContractInfo(request.contractInfo || "");
            setReferenceRequest(request.referenceRequest || "");
            setInternalNotes(request.internalNotes || "");
        }
    }, [request, id]);

    // ============================
    // DROPDOWN HANDLERS
    // ============================

    const toggleAnalyst = (id) => {
        if (selectedAnalysts.includes(id)) {
            setSelectedAnalysts(selectedAnalysts.filter(a => a !== id));
        } else {
            setSelectedAnalysts([...selectedAnalysts, id]);
        }
    };


    // ============================
    // FILE HANDLERS
    // ============================
    const handleFileUpload = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    };

    const handleDragOver = (e) => e.preventDefault();

    // Close dropdown
    useEffect(() => {
        const handler = (e) => {
            if (respRef.current && !respRef.current.contains(e.target)) setRespOpen(false);
            if (multiRef.current && !multiRef.current.contains(e.target)) setMultiOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ============================
    // API MUTATIONS
    // ============================
    const [createProject] = useCreateProjectMutation();

    const [updateProject] = useUpdateProjectMutation();


    // ============================
    // FINAL PAYLOAD
    // ============================
    const buildPayload = () => ({
        projectName,
        projectSubject,
        reportType,
        entityType,
        priority,
        deliverableLanguage: language,
        projectDescription,

        clientName,
        clientContactPerson: clientPerson,
        clientEmail,
        clientPhone,
        clientPosition,

        contractNumber: contractNo,
        annexNumber: annexNo,
        servicesRequested: services.split(",").map(s => s.trim()),
        projectPrice,

        contractInfo,
        referenceRequest,
        internalNotes,
        responsibleAnalyst: responsible,
        assignedAnalysts: selectedAnalysts,

        deadline,
    });

    // ============================
    // SAVE HANDLER
    // ============================
    const handleSave = async () => {
        const payload = buildPayload();

        try {
            if (id) {
                // UPDATE PROJECT
                await updateProject({ id, ...payload }).unwrap();
                toast.success("Proiect actualizat cu succes!");
            }
            else {
                // CREATE PROJECT
                await createProject(payload).unwrap();
                toast.success("Proiect creat cu succes!");
            }

        } catch (err) {
            console.log(err);
            toast.error("Eroare la salvare!");
        }
    };

    // ============================
    // LOADING
    // ============================
    if (isLoading) return <div className="loading">Se încarcă datele...</div>;

    // ============================
    // RENDER UI
    // ============================

    return (
        <div className="page-wrapper1">

            <div className="page-container">

                <div className="project-header-box">
                    <span className="project-header-back">
                        <a href="/manager/dashboard">← Înapoi</a>
                    </span>
                    <h1 className="project-header-title">
                        {id ? "Creează proiect din solicitare" : "Creează proiect nou"}
                    </h1>
                </div>

                {/* ----------------------------- */}
                {/* PROJECT DETAILS */}
                {/* ----------------------------- */}
                <div className="form-card">
                    <h2 className="form-title">Detalii proiect</h2>

                    {/* ROW 1 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Denumire proiect</label>
                            <input className="input-box" value={projectName}
                                   onChange={(e) => setProjectName(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Subiect proiect</label>
                            <div className="input-wrapper">
                                <input className="input-box" value={projectSubject}
                                       onChange={(e) => setProjectSubject(e.target.value)} />

                            </div>
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="row-four">
                        <div className="form-field">
                            <label>Tip raport</label>
                            <input className="input-box" value={reportType}
                                   onChange={(e) => setReportType(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Tip entitate</label>
                            <input className="input-box" value={entityType}
                                   onChange={(e) => setEntityType(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Termen limită</label>
                            <input type="date" className="input-box bold" value={deadline}
                                   onChange={(e) => setDeadline(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Prioritate</label>
                            <input className="input-box" value={priority}
                                   onChange={(e) => setPriority(e.target.value)} />
                        </div>
                    </div>

                    {/* ROW 3 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Limbă livrabil</label>
                            <input className="input-box" value={language}
                                   onChange={(e) => setLanguage(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Fișiere atașate</label>

                            <div className="dropzone"
                                 onDrop={handleDrop}
                                 onDragOver={handleDragOver}
                                 onClick={() => document.getElementById("fileInput").click()}>
                                <p>📁 Click sau trage fișiere aici</p>
                            </div>

                            <input id="fileInput" type="file" hidden multiple onChange={handleFileUpload} />

                            {files.map((file, i) => (
                                <div className="file-item" key={i}>
                                    📄 {file.name} • {(file.size / 1024).toFixed(1)} KB
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-field full-width">
                        <label>Descriere proiect</label>
                        <textarea className="textarea-box" value={projectDescription}
                                  onChange={(e) => setProjectDescription(e.target.value)} />
                    </div>
                </div>

                {/* ----------------------------- */}
                {/* RESPONSIBLES */}
                {/* ----------------------------- */}
                <div className="form-card">
                    <h2 className="form-title">Responsabili proiect</h2>

                    <div className="row-two">

                        {/* RESPONSIBLE */}
                        <div className="form-field" ref={respRef}>
                            <label>Responsabil (1)</label>

                            <div className="dropdown-box" onClick={() => setRespOpen(!respOpen)}>
                               <span>
  {analystOptions.find(a => a.id === responsible)?.name || "Selectează responsabilul"} ▾
</span>

                            </div>

                            {respOpen && (
                                <div className="dropdown-list">
                                    {analystOptions.map((a) => (
                                        <label className="radio-item" key={a.id}>
                                            <input
                                                type="radio"
                                                checked={responsible === a.id}
                                                onChange={() => {
                                                    setResponsible(a.id);
                                                    setRespOpen(false);
                                                }}
                                            />
                                            {a.name}
                                        </label>
                                    ))}

                                </div>
                            )}
                        </div>

                        {/* MULTI SELECT ANALYSTS */}
                        <div className="form-field" ref={multiRef}>
                            <label>Analiști suplimentari</label>

                            <div
                                className="dropdown-box"
                                onClick={() => setMultiOpen(!multiOpen)}
                            >
  <span>
    {selectedAnalysts.length
        ? selectedAnalysts
            .map(id => analystOptions.find(a => a.id === id)?.name || "")
            .join(", ")
        : "Selectează ▾"}
  </span>
                            </div>


                            {multiOpen && (
                                <div className="dropdown-list">
                                    {analystOptions.map((a) => (
                                        <label className="checkbox-item" key={a.id}>
                                            <input
                                                type="checkbox"
                                                checked={selectedAnalysts.includes(a.id)}
                                                onChange={() => toggleAnalyst(a.id)}   // 👈 store ID
                                            />
                                            {a.name}  {/* 👈 show name */}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {/* ----------------------------- */}
                {/* CLIENT CONTRACT DETAILS */}
                {/* ----------------------------- */}
                <div className="form-card">
                    <h2 className="form-title">Detalii contract & client</h2>

                    {/* ROW 1 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Nume client</label>
                            <input className="input-box" value={clientName}
                                   onChange={(e) => setClientName(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Persoană de contact</label>
                            <input className="input-box" value={clientPerson}
                                   onChange={(e) => setClientPerson(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Funcție</label>
                            <input className="input-box" value={clientPosition}
                                   onChange={(e) => setClientPosition(e.target.value)} />
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Email</label>
                            <input className="input-box" value={clientEmail}
                                   onChange={(e) => setClientEmail(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Telefon</label>
                            <input className="input-box" value={clientPhone}
                                   onChange={(e) => setClientPhone(e.target.value)} />
                        </div>
                    </div>

                    {/* ROW 3 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Nr. contract</label>
                            <input className="input-box" value={contractNo}
                                   onChange={(e) => setContractNo(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Nr. anexă</label>
                            <input className="input-box" value={annexNo}
                                   onChange={(e) => setAnnexNo(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Se dorește</label>
                            <input className="input-box" value={services}
                                   onChange={(e) => setServices(e.target.value)} />
                        </div>
                    </div>

                    {/* ROW 4 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Preț proiect</label>
                            <input className="input-box" value={projectPrice}
                                   onChange={(e) => setProjectPrice(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Monedă</label>
                            <input className="input-box" value="EUR" disabled />
                        </div>
                    </div>

                    {/* ROW 5 */}
                    <div className="row-two">
                        <div className="form-field">
                            <label>Alte informații despre contract</label>
                            <textarea className="textarea-box" value={contractInfo}
                                      onChange={(e) => setContractInfo(e.target.value)} />
                        </div>

                        <div className="form-field">
                            <label>Solicitare referințe</label>
                            <textarea className="textarea-box" value={referenceRequest}
                                      onChange={(e) => setReferenceRequest(e.target.value)} />
                        </div>
                    </div>

                    {/* ROW 6 */}
                    <div className="form-field full-width">
                        <label>Note interne</label>
                        <textarea className="textarea-box" value={internalNotes}
                                  onChange={(e) => setInternalNotes(e.target.value)} />
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="button-row">
                        <button className="createProject" onClick={handleSave}>
                            {id ? "Actualizează & aprobă" : "Creează pagina proiect"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NewProject;
