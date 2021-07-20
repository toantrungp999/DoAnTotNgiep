// import React, { Component } from 'react';
// import { Link, Route } from 'react-router-dom';
// import './topBody.css';
// class SearchByBrands extends Component {

//   constructor(props) {
//     super(props);
//     this.state = { viewMore: false, clientWidth: 0 }
//     window.addEventListener('resize', this.updateSize);
//   }

//   updateSize = () => {
//     if (this.divElement)
//       this.setState({ clientWidth: this.divElement.clientWidth });
//   }

//   componentDidMount() {
//     if (this.divElement)
//       this.setState({ clientWidth: this.divElement.clientWidth });
//   }

//   render() {
//     const { loading, brands } = this.props.brandsReducer;
//     if (!loading) {
//       let count = 0;
//       const linksBrand = brands ?
//         brands.map((brand, index) => {
//           count++;
//           let path = `/brand=${brand._id}`;
//           if (!this.state.viewMore && (count + 1) * 80 > this.state.clientWidth)
//             return null;
//           return <Route
//             key={brand._id}
//             index={index}
//             path={path}
//             children={({ match }) => {
//               let active = match ? 'nav-link active search-nav-link' : 'nav-link search-nav-link';
//               return <li style={{ width: '112px' }}><Link className={active} to={path}>{brand.name}</Link></li>
//             }}
//           />
//         }) : [];
//       if (!this.state.viewMore)
//         linksBrand.push(<Link key="read-more-searchByBrand" className="nav-link search-nav-link" to="#" onClick={(e) => { e.preventDefault(); this.setState({ viewMore: true }); }}>Xem thêm</Link>)
//       return (
//         <nav className="nav nav-tabs nav-stacked search-background" ref={(divElement) => { this.divElement = divElement }}>
//           {linksBrand}
//         </nav>
//       );
//     }
//     else
//       return ('');
//   }
// }

// export default SearchByBrands;
