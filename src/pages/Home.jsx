import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { normalizeText } from "../utils/normalize";

function Home() {
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [cidade, setCidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const { usuario, carregando } = useAuth();

  const adminEmail = "noe@casamilitar.es.gov.br";
  const ehAdmin = usuario?.email === adminEmail;

  const buscarDados = async () => {
    try {
      const ref = collection(db, "dados");
      let q;

      if (busca.trim()) {
        const buscaNormalizada = normalizeText(busca.trim());
        q = query(
          ref,
          where("cidadeNormalizada", ">=", buscaNormalizada),
          where("cidadeNormalizada", "<=", buscaNormalizada + "\uf8ff")
        );
      } else {
        q = ref;
      }

      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDados(lista);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleAdd = async () => {
    if (!cidade || !descricao) {
      return alert("Preencha todos os campos obrigatórios");
    }

    try {
      const ref = collection(db, "dados");
      await addDoc(ref, {
        cidade,
        cidadeNormalizada: normalizeText(cidade),
        descricao,
      });
      setCidade("");
      setDescricao("");
      buscarDados();
    } catch (error) {
      console.error("Erro ao adicionar dado:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "dados", id));
      buscarDados();
    } catch (error) {
      console.error("Erro ao excluir dado:", error);
    }
  };

  const handleEdit = (item) => {
    setEditandoId(item.id);
    setCidade(item.cidade || "");
    setDescricao(item.descricao);
  };

  const handleUpdate = async () => {
    if (!cidade || !descricao) {
      return alert("Preencha todos os campos");
    }

    try {
      const ref = doc(db, "dados", editandoId);
      await updateDoc(ref, {
        cidade,
        cidadeNormalizada: normalizeText(cidade),
        descricao,
      });
      setEditandoId(null);
      setCidade("");
      setDescricao("");
      buscarDados();
    } catch (error) {
      console.error("Erro ao atualizar dado:", error);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  if (carregando) {
    return (
      <div className="verificando-login">
        <p>Verificando login...</p>
      </div>
    );
  }

  return (
    <div className="pagina-home">
      <Navbar />
  
      <div className="container-centralizado">
        <div className="box-dados">
          <h1 className="titulo">Lista de Dados</h1>
  
          <div className="campo-busca linha">
            <input
              type="text"
              placeholder="Buscar por cidade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button onClick={buscarDados} className="search-button">
              Buscar
            </button>
          </div>
  
          {ehAdmin && (
            <div className="formulario-admin coluna">
              <input
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
  
              <textarea
                placeholder="Descrição com links e detalhes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
              />
  
              {editandoId ? (
                <button onClick={handleUpdate} className="btn-atualizar">
                  Atualizar
                </button>
              ) : (
                <button onClick={handleAdd} className="add-button">
                  Adicionar
                </button>
              )}
            </div>
          )}
  
          <ul className="lista-dados">
            {dados.map((item) => (
              <li key={item.id} className="item-dado">
              <div className="descricao-formatada">
                
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.descricao.replace(
                      /(\b(https?:\/\/)?(www\.)?[\w-]+\.[\w./?=&%-]+)/gi,
                      (match) => {
                        const href = match.startsWith("http")
                          ? match
                          : `https://${match}`;
                        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
                      }
                    ),
                  }}
                />
                {ehAdmin && (
                  <div className="acoes-admin">
                    <button onClick={() => handleEdit(item)} className="add-button">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="del-button">
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </li>
            
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
