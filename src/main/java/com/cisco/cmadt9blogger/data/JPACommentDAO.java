package com.cisco.cmadt9blogger.data;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.cisco.cmadt9blogger.api.BlogComment;

public class JPACommentDAO extends JPABloggerDAO /*implements CommentDAO*/{

	public void createComment(BlogComment comment) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		em.persist(comment);
		em.getTransaction().commit();
		em.close();		
	}

	public BlogComment readComment(int commentId) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		BlogComment comment = em.find(BlogComment.class,commentId);
		em.getTransaction().commit();
		em.close();
		return comment;
	}

	public List<BlogComment> getAllComments(int blogId,int offset,int pageSize,String sortOrder) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		final CriteriaBuilder builder = em.getCriteriaBuilder();
		CriteriaQuery<BlogComment> criteriaQuery = builder.createQuery(BlogComment.class);
		Root<BlogComment> blogComment = criteriaQuery.from(BlogComment.class);
		CriteriaQuery<BlogComment> select = criteriaQuery.select(blogComment);
		select.where(builder.equal(blogComment.get("blog").get("blogId"),blogId));	
		System.out.println("JPABlogCommentDAO getAllComments sortOrder :"+sortOrder);
		if(sortOrder != null && sortOrder.trim() != "" && sortOrder.equals("newest")) {
			System.out.println("JPABlogCommentDAO getAllComments descending - newest :");
			criteriaQuery.orderBy(builder.desc(blogComment.get("postedDate")));
		}else {
			System.out.println("JPABlogCommentDAO getAllComments ascending - oldest :");
			criteriaQuery.orderBy(builder.asc(blogComment.get("postedDate")));
		}
		TypedQuery<BlogComment> typedQuery = em.createQuery(select);
		offset = offset * pageSize;
		typedQuery.setFirstResult(offset);
		typedQuery.setMaxResults(pageSize);
		System.out.println("JPABlogCommentDAO getAllComments Current page: " + typedQuery.getResultList());
		List<BlogComment> commentList = typedQuery.getResultList();
		em.getTransaction().commit();
		em.close();
		return commentList;
	}

	public long getCommentCount(int blogId) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		final CriteriaBuilder builder = em.getCriteriaBuilder();
		final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
		Root<BlogComment> blogComment = countQuery.from(BlogComment.class);
		CriteriaQuery<Long> select = countQuery.select(builder.count(blogComment));
		select.where(builder.equal(blogComment.get("blog").get("blogId"),blogId));
		System.out.println("JPA getCommentCount blogComment.get:"+(blogComment.get("blog")));
		System.out.println("JPA getCommentCount blogComment.get ID:"+(blogComment.get("blog")).get("blogId"));
		System.out.println("JPA getCommentCount blogId :"+blogId);
		long blogCommentCount = em.createQuery(countQuery).getSingleResult();
		System.out.println("JPA getCommentCount blogCommentCount :"+blogCommentCount);
		em.getTransaction().commit();
		em.close();
		return blogCommentCount;
	}

	public void deleteComment(int commentId) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		BlogComment comment = em.find(BlogComment.class,commentId);
		em.remove(comment);
		em.getTransaction().commit();
		em.close();
	}
}
