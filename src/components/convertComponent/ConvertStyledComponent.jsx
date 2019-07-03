import styled from 'styled-components'


const ConvertComponentStyled = styled.div`
text-align: center;
height: 100%;
background-color: #eeeeee;


.card{
  box-shadow: 1px 1px 16px rgba(0,0,0,0.5);
  width: 55%;
  display: inline-block;
  min-height: 75%;
  margin-top: 5%;
  text-align: justify;

  
}

.form-row{
  margin-top: 25px;
}

input[type='file'] {
  display: none
}

.desloca-esquerda{
  margin-left: 30px;
}

/* Aparência que terá o seletor de arquivo */
.label-file {
  background-color: #3498db;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  padding: 6px 20px
}


.label-logo{
  margin: 30px 0px 0px 30px;
}
    

.swatch: {
  padding: '5px',
  background: '#fff',
  borderRadius: '1px',
  boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
  display: 'inline-block',
  cursor: 'pointer',
};
.popover: {
  top: 42px !important;
  position: 'absolute',
  zIndex: '2',
};
.cover: {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
};
`;

export default ConvertComponentStyled;

