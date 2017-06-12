package com.cisco.cmadt9blogger.api;

import java.util.Date;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.PrePersist;


//import javax.persistence.Entity;
//import javax.persistence.GeneratedValue;
//import javax.persistence.GenerationType;
//import javax.persistence.Id;
//import javax.persistence.JoinColumn;
//import javax.persistence.ManyToOne;
//import javax.persistence.OneToOne;
//import javax.persistence.PrePersist;
//import javax.persistence.Temporal;
//import javax.persistence.TemporalType;
//import javax.validation.constraints.NotNull;

@Entity
public class BlogComment {

	@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	private String commentId = new ObjectId().toHexString();
	//@NotNull
	private String comment;
	//@OneToOne
	//@JoinColumn(name = "userId")
	//@NotNull
	private String commentorId;
	//@Temporal(TemporalType.TIMESTAMP)
	private Date postedDate;
	//@ManyToOne
	//@JoinColumn(name = "blogId")
	//@NotNull
	private String blogId;

	public BlogComment() {
		super();
	}

	public BlogComment(String commentId, String comment, String commentorId, Date postedDate, String blogId) {
		super();
		this.commentId = commentId;
		this.comment = comment;
		this.commentorId = commentorId;
		this.postedDate = postedDate;
		this.blogId = blogId;
	}

	@PrePersist
	protected void onCreate() {
		postedDate = new Date();
	}

	public String getCommentId() {
		return commentId;
	}

	public void setCommentId(String commentId) {
		this.commentId = commentId;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getCommentorId() {
		return commentorId;
	}

	public void setCommentorId(String commentorId) {
		this.commentorId = commentorId;
	}

	public Date getPostedDate() {
		return postedDate;
	}

	public void setPostedDate(Date postedDate) {
		this.postedDate = postedDate;
	}

	public String getBlogId() {
		return blogId;
	}

	public void setBlogId(String blogId) {
		this.blogId = blogId;
	}
}
