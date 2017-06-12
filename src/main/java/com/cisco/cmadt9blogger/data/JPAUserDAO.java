package com.cisco.cmadt9blogger.data;

import javax.persistence.EntityManager;

import com.cisco.cmadt9blogger.api.User;



public class JPAUserDAO extends JPABloggerDAO implements UserDAO{

	public void createUser(User user) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		System.out.println("JPAUserDAO createUser");
		em.persist(user);
		em.getTransaction().commit();
		em.close();
	}
	
	public User readUser(String userId) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		User user = em.find(User.class,userId);
		System.out.println("JPAUserDAO readUser user :"+user);
		em.getTransaction().commit();
		em.close();
		return user;
	}
	
	public void updateUser(User user) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		User storedUser = em.find(User.class,user.getUserId());
		System.out.println("JPAUserDAO updateUser user :"+user);
		if(user.getNickName() != null && user.getNickName().trim() != ""){
			storedUser.setNickName(user.getNickName());
		}
		if(user.getFirstName() != null && user.getFirstName().trim() != ""){
			storedUser.setFirstName(user.getFirstName());
		}
		if(user.getLastName() != null && user.getLastName().trim() != "") {
			storedUser.setLastName(user.getLastName());
		}
		if(user.getPassword() != null && user.getPassword().trim() != "") {
			storedUser.setPassword(user.getPassword());
		}
		
		em.getTransaction().commit();
		em.close();
	}

	public void deleteUser(String userId) {
		EntityManager em = factory.createEntityManager();
		em.getTransaction().begin();
		User user = em.find(User.class,userId);
		System.out.println("JPAUserDAO deleteUser user :"+user);
		em.remove(user);
		em.getTransaction().commit();
		em.close();	
	}
}
