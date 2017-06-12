package com.cisco.cmadt9blogger.data;

import java.util.ArrayList;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.cisco.cmadt9blogger.api.Blog;

public class JPABlogDAO extends JPABloggerDAO /*implements BlogDAO */{

	public void createBlog(Blog blog) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		em.persist(blog);
		em.getTransaction().commit();
		em.close();

	}

	public Blog readBlog(int blogId) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		Blog blog = em.find(Blog.class,blogId);
		em.getTransaction().commit();
		em.close();
		return blog;
	}

	public List<Blog> getAllBlogs(int offset,int pageSize,String searchStr,String userFilter) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		final CriteriaBuilder builder = em.getCriteriaBuilder();
		CriteriaQuery<Blog> criteriaQuery = builder.createQuery(Blog.class);
		Root<Blog> blog = criteriaQuery.from(Blog.class);
		CriteriaQuery<Blog> select = criteriaQuery.select(blog);
		System.out.println("JPABlogDAO getAllBlogs SearchStr :"+searchStr);
		System.out.println("JPABlogDAO getAllBlogs userFilter :"+userFilter);
		List<Predicate> predicates = new ArrayList<Predicate>();
		if(searchStr != null && searchStr.trim() != "")
		{
			System.out.println("JPABlogDAO getAllBlogs in searchStr");
			predicates.add(builder.like(builder.lower(blog.get("title")), "%"+searchStr.toLowerCase()+"%"));
		}
		if(userFilter != null  && userFilter.trim() != ""){
			System.out.println("JPABlogDAO getAllBlogs in userFilter:"+userFilter);
			predicates.add(builder.like(builder.lower(blog.get("user").get("userId")), userFilter));
		}
		select.where(predicates.toArray(new Predicate[]{}));
		criteriaQuery.orderBy(builder.desc(blog.get("postedDate")));		 
		TypedQuery<Blog> typedQuery = em.createQuery(select);
		offset = offset * pageSize;
		typedQuery.setFirstResult(offset);
		typedQuery.setMaxResults(pageSize);
		System.out.println("JPABlogDAO getAllBlogs Current page: " + typedQuery.getResultList());
		List<Blog> blogList = typedQuery.getResultList();
		em.getTransaction().commit();
		em.close();
		return blogList;
	}

	public long getBlogCount(String searchStr,String userFilter) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		final CriteriaBuilder builder = em.getCriteriaBuilder();
		final CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
		Root<Blog> blog = countQuery.from(Blog.class);
		CriteriaQuery<Long> select = countQuery.select(builder.count(blog));
		System.out.println("JPABlogDAO getBlogCount SearchStr :"+searchStr);
		System.out.println("JPABlogDAO getBlogCount userFilter :"+userFilter);
		List<Predicate> predicates = new ArrayList<Predicate>();
		if(searchStr != null && searchStr.trim() != "")
		{
			System.out.println("JPABlogDAO getBlogCount in searchStr");
			predicates.add(builder.like(builder.lower(blog.get("title")), "%"+searchStr.toLowerCase()+"%"));
		}
		if(userFilter != null  && userFilter.trim() != ""){
			System.out.println("JPABlogDAO getBlogCount in userFilter:"+userFilter);
			predicates.add(builder.like(builder.lower(blog.get("user").get("userId")), userFilter));
		}
		select.where(predicates.toArray(new Predicate[]{}));
		long blogCount = em.createQuery(countQuery).getSingleResult();
		em.getTransaction().commit();
		em.close();
		return blogCount;
	}

	public void deleteBlog(int blogId) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		Blog blog = em.find(Blog.class,blogId);
		em.remove(blog);
		em.getTransaction().commit();
		em.close();
	}
}
