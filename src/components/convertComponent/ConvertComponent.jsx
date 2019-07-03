import React, { Component } from 'react';
 
import { Button, Col, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import ConvertComponentStyled from './ConvertStyledComponent';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const leitorDeCSV = new FileReader();

class ConvertComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      validated: false, logo: '', pictures: [], imgSrc: null, doc: "", listaLinhas: []
    }

    this.downloadPdf = this.downloadPdf.bind(this);
    this.validaCampos = this.validaCampos.bind(this);
    this.leCSV = this.leCSV.bind(this);


  }


  componentDidMount() {



  }

  header(nome, doc) {

    doc.setFontSize(30);
    doc.text(100, 25, nome, 'right');
    doc.setFontSize(16);

    let imgData = this.state.imgSrc;
    doc.addImage(imgData, 'JPEG', 15, 10, 30, 30)
  };



  downloadPdf(listaData) {
    const doc = new jsPDF();
    let nomeEmpresa = listaData[0].value;

    let totalPagesExp = "{total_pages_count_string}";
    let imgData = this.state.imgSrc;
    let date = new Date()
    let datatFormata = `${date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate()}/${date.getMonth().toString().length > 1 ? date.getMonth() : '0' + date.getMonth()}/${date.getFullYear()}`;


    let listaLinha = [];

    for (let i = 0; i < this.state.listaLinhas.length; i++) {
      const linha = this.state.listaLinhas[i];
      let linhaAux = [];

      for (let j = 0; j < linha.length; j++) {
        const element = linha[j];

        if(!listaData[2].checked && j === 1){
          continue;
        }
        if(!listaData[3].checked && j === 4){
          continue;
        }


        linhaAux.push(element);
      }

      if (linhaAux.length > 0) {
        listaLinha.push(linhaAux);
      }

    }

    doc.autoTable({
      head: [listaLinha[0]],
      body: listaLinha.slice(1, listaLinha.length - 1),
      didDrawPage: function (data) {
        // Header
        doc.setFontSize(30);
        doc.text(100, 25, nomeEmpresa, 'center');
        doc.setFontSize(16);

        doc.addImage(imgData, 'JPEG', 15, 10, 30, 30);

        // Footer
        var str = "Página " + doc.internal.getNumberOfPages()
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.setFontSize(8);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(175, pageHeight - 10, str);


        doc.text(datatFormata, data.settings.margin.left, pageHeight - 10, "");

      },
      margin: { top: 50 }

    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save('table.pdf');
  }

  validaCampos(event) {
    event.preventDefault();
    const form = event.currentTarget;

    console.log("nome da empresa ", form.elements[0].value);

    if (form.checkValidity()) {
      this.setState({ validated: false });
      this.downloadPdf(form.elements);
    } else {
      this.setState({ validated: true });
    }
  }



  extractImageFileExtensionFromBase64(base64Data) {
    return base64Data.substring('data:image/jpeg'.length, base64Data.indexOf(';base64'))
  }

  handleFileSelect = event => {
    const files = event.target.files
    if (files && files.length > 0) {
      const isVerified = true
      if (isVerified) {
        // imageBase64Data 
        const currentFile = files[0]
        const myFileItemReader = new FileReader()
        myFileItemReader.addEventListener("load", () => {
          const myResult = myFileItemReader.result
          this.setState({
            imgSrc: myResult,
            imgSrcExt: this.extractImageFileExtensionFromBase64(myResult)
          })
        }, false)

        myFileItemReader.readAsDataURL(currentFile)

      }
    }
  }

  handleFiles = event => {
    let file = event.target.files[0];
    leitorDeCSV.onload = this.leCSV;
    leitorDeCSV.readAsText(file, 'UTF-16');

  }

  leCSV(evt) {

    let fileArr = evt.target.result.split('\n');
    let arrayLinha = [];

    for (var i = 0; i < fileArr.length; i++) {
      var fileLine = fileArr[i].split(/[^a-zA-Z0-9]+/g);
      let linha = [];
      for (var j = 0; j < fileLine.length; j++) {
        let item = fileLine[j];
        if (item.length > 0 && j < 6) {
          linha.push(item);
        }
      }

      if (fileLine[6] === "DateTime") {
        linha.push("Data");
        linha.push("Hora");

      } else {
        linha.push(`${fileLine[6]}/${fileLine[7]}/${fileLine[8]}`);
        linha.push(`${fileLine[9]}:${fileLine[10]}:${fileLine[11]}`);

      }

      arrayLinha.push(linha);
    }


    let arrayAux = []

    for (let i = 0; i < arrayLinha.length; i++) {
      const linha = arrayLinha[i];
      let linhaAux = [];

      for (let j = 0; j < linha.length; j++) {
        let element = linha[j];

        if (j === 5 || element.indexOf("undefined") > -1) {
          continue;
        }

        switch (element.toUpperCase().trim()) {
          case "NO":
            element = "Verificações"
            break;
          case "ENNO":
            element = "Identificação"
            break;
          case "NAME":
            element = "Nome"
            break;
          default:
            break;
        }

        linhaAux.push(element);
      }

      if (linhaAux.length > 0) {
        arrayAux.push(linhaAux);
      }

    }
    console.log("cmd wag ", arrayAux);

    this.setState({
      listaLinhas: arrayAux
    })

  }

  render() {
    return (
      <ConvertComponentStyled>

        <Card>
          <Card.Header> Transformar Txt em PDF </Card.Header>
          <Card.Body>

            <Form
              noValidate
              validated={this.state.validated}
              onSubmit={e => this.validaCampos(e)}>
              <Form.Row>
                <Form.Group as={Col} controlId="nomeEmpresa">
                  <Form.Label >Nome da Empresa</Form.Label>
                  <Form.Control type="text" required placeholder="Digite o nome da empresa" />

                  <Form.Control.Feedback type="invalid">
                    Por favor digite o nome da empresa.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="logo">
                  <Form.Label className="label-file label-logo" > Selecion uma Logo</Form.Label>

                  <Form.Control accept="image/*" type='file' multiple={false} onChange={this.handleFileSelect} required placeholder="Selecione a logo" />

                  <Form.Control.Feedback className="desloca-esquerda" onChange={this.setarLogo} type="invalid">
                    Por favor selecione uma logo.
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="mostraCampoMchn">
                  <Form.Check
                    label="Mostrar Coluna Mchn"
                  />
                </Form.Group>

                <Form.Group style={{ left: "30px" }}  as={Col} controlId="mostraCampoMode">
                  <Form.Check
                    label="Mostrar Coluna Mode"
                  />
                </Form.Group>

              </Form.Row>


              <Form.Row>
                <Form.Group as={Col} controlId="aquivo">
                  <Form.Label className="label-file">Selecione o arquivo (txt)</Form.Label>
                  <Form.Control type="file" accept=".txt" onChange={e => this.handleFiles(e)} required placeholder="Selecione o arquivo" />
                  <Form.Control.Feedback type="invalid">
                    Por favor selecione o arquivo.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group style={{ left: "30px" }} as={Col} controlId="aquivo">
                  <Button variant="success" type="submit">
                    Gerar PDF
                  </Button>
                </Form.Group>
              </Form.Row>

            </Form>

          </Card.Body>

        </Card>



      </ConvertComponentStyled>
    )
  }
}

export default ConvertComponent;