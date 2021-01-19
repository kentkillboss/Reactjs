import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://192.168.1.6:8080/user/all";
const urldelete = "http://192.168.1.6:8080/user/delete/";
const urlupdate = "http://192.168.1.6:8080/user/update/";
const urladd = "http://192.168.1.6:8080/user/insert";

class App extends Component {
state={
  data:[],
  modalInsertar: false,
  modalEliminar: false,
  form:{
    CustomerID: '',
    CustomerName: '',
    ContactName: '',
    Address: '',
    City: '',
    PostalCode: '',
    Country: '',
    cc: ''
  }
}

peticionGet=()=>{
axios.get(url).then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
  delete this.state.form.CustomerID;
 await axios.post(urladd,this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}

peticionPut=()=>{
  axios.put(urlupdate+this.state.form.CustomerID, this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  })
}

peticionDelete=()=>{
  axios.delete(urldelete+this.state.form.CustomerID).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}

modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}

seleccionarEmpresa=(empresa)=>{
  this.setState({
    cc: 'actualizar',
    form: {
      CustomerID: empresa.CustomerID,
      CustomerName: empresa.CustomerName,
      ContactName: empresa.ContactName,
      Address: empresa.Address,
      City: empresa.City,
      PostalCode: empresa.PostalCode,
      Country: empresa.Country
    }
  })
}

handleChange=async e=>{
e.persist();
await this.setState({
  form:{
    ...this.state.form,
    [e.target.name]: e.target.value
  }
});
console.log(this.state.form);
}

  componentDidMount() {
    this.peticionGet();
  }
  

  render(){
    const {form}=this.state;
  return (
    <div className="App">
    <br /><br /><br />
  <button className="btn btn-success" onClick={()=>{this.setState({form: null, cc: 'insertar'}); this.modalInsertar()}}>Thêm</button>
  <br /><br />
    <table className="table ">
      <thead>
        <tr>
          <th>ID</th>
          <th>CustomerName</th>
          <th>ContactName</th>
          <th>Address</th>
          <th>City</th>
          <th>PostalCode</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        {this.state.data.map(empresa=>{
          return(
            <tr>
          <td>{empresa.CustomerID}</td>
          <td>{empresa.CustomerName}</td>
          <td>{empresa.ContactName}</td>
          <td>{empresa.Address}</td>
          <td>{empresa.City}</td>
          <td>{empresa.PostalCode}</td>
          <td>{empresa.Country}</td>
          <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarEmpresa(empresa); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarEmpresa(empresa); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        })}
      </tbody>
    </table>



    <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="CustomerID" id="id" readOnly onChange={this.handleChange} value={form?form.CustomerID: this.state.data.length+1}/>
                    <br />
                    <label htmlFor="nombre">CustomerName</label>
                    <input className="form-control" type="text" name="CustomerName" id="CustomerName" onChange={this.handleChange} value={form?form.CustomerName: ''}/>
                    <br />
                    <label htmlFor="nombre">ContactName</label>
                    <input className="form-control" type="text" name="ContactName" id="ContactName" onChange={this.handleChange} value={form?form.ContactName: ''}/>
                    <br />
                    <label htmlFor="nombre">Address</label>
                    <input className="form-control" type="text" name="Address" id="Address" onChange={this.handleChange} value={form?form.Address: ''}/>
                    <br />
                    <label htmlFor="nombre">City</label>
                    <input className="form-control" type="text" name="City" id="City" onChange={this.handleChange} value={form?form.City: ''}/>
                    <br />
                    <label htmlFor="nombre">PostalCode</label>
                    <input className="form-control" type="text" name="PostalCode" id="PostalCode" onChange={this.handleChange} value={form?form.PostalCode: ''}/>
                    <br />
                    <label htmlFor="nombre">Country</label>
                    <input className="form-control" type="text" name="Country" id="Country" onChange={this.handleChange} value={form?form.Country: ''}/>
                    <br />
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.cc==='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar a la empresa {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
  </div>
  );
}
}
export default App;