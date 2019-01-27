import React, { Component } from 'react';

class Comments extends Component {
    submitComment = event => {
        event.preventDefault();
        let newComment = {};

        newComment['text'] = event.target.newComment.value;
        newComment['user'] = 'me';
        //alert(JSON.stringify(newComment));
        fetch(window.API_URL+'/'+this.props.commentType+"/"+this.props.scope+"/comments", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newComment)
        })
        .then(response => response.json())
        .then(event.target.newComment.value = "");
    }
    
    render() {
		return (
            <div className="commentsContainer">
                 <form onSubmit={this.submitComment}>
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
                            <tr key={comment._id} > 
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