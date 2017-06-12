package com.cisco.cmadt9blogger.data;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class JPABloggerDAO {

	protected EntityManagerFactory factory = Persistence.createEntityManagerFactory("com.cisco.blogger");

}
