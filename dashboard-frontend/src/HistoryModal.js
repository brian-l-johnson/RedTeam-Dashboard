import React, { Component } from 'react';

class HistoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
  }

  toggleModal = () => {
    console.log("toggling modal state");
    this.setState({
      isOpen: !this.state.isOpen
    });
  }



  render() {
    return (
        <span>
            <i className="fas fa-history" onClick={this.toggleModal}></i>
            {
                this.state.isOpen && (
                    <div className="modal fade show " style={{display: "block", "backgroundColor": "rgba(0,0,0,0.5)"}} id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Port HIstory</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" onClick={this.toggleModal}>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>State</th>
                                            <th>Start</th>
                                            <th>End</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.history.map(h => (
                                                <tr key={h._id}><td>{h.state}</td><td>{h.start}</td><td>{h.end}</td></tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.toggleModal}>Close</button>
                               </div>
                            </div>

                            </div>
                        </div>
                       
                    </div>
                )
            }

        </span>
    );
  }
}

export default HistoryModal;