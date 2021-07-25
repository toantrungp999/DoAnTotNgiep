// import React, { Component } from 'react';
// import { Slide } from '@material-ui/core';
// import './SuccessAlert.css';

// class ErrorAlert extends Component {
//     componentDidMount() {
//         setTimeout(() => {
//             this.onHide();
//         }, 4000);
//     }

//     componentDidUpdate(){
//         if(this.props.show === true){
//             setTimeout(() => {
//                 this.onHide();
//             }, 4000);
//         }
//     }

//     onHide = () => {
//         this.props.onHideAlert();
//     }

//     render() {
//         return (
//             <Slide in={this.props.show} direction="down">
//                 <label id='fail' className="alert alert-danger fade show border border-danger" role="alert">
//                     <strong>{this.props.alertType !== undefined ?
//                         this.props.alertType + '! ' : ''}</strong>{this.props.alert}
//                     <button type="button" className="close pl-2" onClick={this.onHide} aria-label="Close">
//                         <span aria-hidden="true">&times;</span>
//                     </button>
//                 </label>
//             </Slide>
//         )
//     }
// }

// export default ErrorAlert;
