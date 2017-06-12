package com.cisco.cmadt9blogger.data;

import java.util.List;

import org.bson.types.ObjectId;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.dao.BasicDAO;
import org.mongodb.morphia.query.FindOptions;
import org.mongodb.morphia.query.Query;

import com.cisco.cmadt9blogger.api.BlogComment;

public class MongoCommentsDAO extends BasicDAO<BlogComment, String>implements CommentDAO {

	public MongoCommentsDAO(Class<BlogComment> entityClass, Datastore ds) {
		super(entityClass, ds);
	}
	
	@Override
	public void createComment(BlogComment comment) {
		save(comment);
	}

	@Override
	public BlogComment readComment(String commentId) {
		//ObjectId objId = new ObjectId(commentId);
		//return get(objId);
		return get(commentId);
	}

	@Override
	public List<BlogComment> getAllComments(String blogId, int offset, int pageSize, String sortOrder) {
		Query<BlogComment> query = createQuery();
		String sortingParam;
		if(sortOrder != null && sortOrder.trim() != "" && sortOrder.equals("newest")) {
			System.out.println("JPABlogCommentDAO getAllComments descending - newest :");
			sortingParam = "-postedDate";
		}else {
			System.out.println("JPABlogCommentDAO getAllComments ascending - oldest :");
			sortingParam = "postedDate";
		}
		offset = offset * pageSize;
		return query.field("blogId").equal(blogId).order(sortingParam).asList(new FindOptions().skip(offset).limit(pageSize));
	}

	@Override
	public long getCommentCount(String blogId) {
		Query<BlogComment> query = createQuery().field("blogId").equal(blogId);
		return query.count();
	}

	@Override
	public void deleteComment(String commentId) {
		//ObjectId objId = new ObjectId(commentId);
		//deleteById(objId);
		deleteById(commentId);
	}
	
	public void deleteAllComments(String blogId){
		final Query<BlogComment> blogCommentsQry = createQuery().field("blogId").equal(blogId);
        deleteByQuery(blogCommentsQry);
	}

}
