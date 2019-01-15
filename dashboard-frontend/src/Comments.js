import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Comments extends Component {
    submitComment = event => {
        event.preventDefault();
        let newComment = {};
        newComment['text'] = document.getElementById('newComment').value;
        newComment['user'] = 'me';
        //alert(JSON.stringify(newComment));
        fetch('http://127.0.0.1:3001/'+this.props.commentType+"/"+this.props.scope+"/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newComment)
        })
        .then(response => response.json())
        .then(document.getElementById('newComment').value = "");
    }
    
    render() {
		return (
            <div className="commentsContainer">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Comment</th>
                            <th>Date</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
 
                        this.props.commentArray.map(comment => (
                            <tr key={comment.id} > 
                                <td>{comment.text}</td>
                                <td>{comment.date}</td>
                                <td>{comment.user}</td>
                            </tr>
                        ))
                        
                        }
                        <tr>
                            <td> <input type="text" className="form-text form-control" id="newComment" placeholder="New comment..." /></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <form onSubmit={this.submitComment}>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
		);
	}
}

Comments.defaultProps = {
    commentArray : []
}

export default Comments;