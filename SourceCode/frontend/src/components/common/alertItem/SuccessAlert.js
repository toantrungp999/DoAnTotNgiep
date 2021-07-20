// import React, { Component } from 'react';
// import { Slide } from '@material-ui/core';
// import './SuccessAlert.css';

// class SuccessAlert extends Component {
//     componentDidMount(){
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
//         console.log("hide");
//         this.props.onHideAlert();
//     }

//     render() {
//         return (
//             <Slide in={this.props.show} direction="down">
//                 <label id='success' className="alert alert-success fade show border border-success" role="alert">
//                     {this.props.alert}
//                     <button type="button" className="close pl-2" onClick={this.onHide} aria-label="Close">
//                         <span aria-hidden="true">&times;</span>
//                     </button>
//                 </label> 
//             </Slide>
//         )
//     }
// }

// export default SuccessAlert;