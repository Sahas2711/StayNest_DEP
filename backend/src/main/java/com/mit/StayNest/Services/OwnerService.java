package com.mit.StayNest.Services;

import java.util.List;

import org.springframework.stereotype.Service;
import com.mit.StayNest.Entity.Owner;


@Service
public interface OwnerService {

	public Owner register(Owner user);

	public Owner login(Owner user);
	
	public List<Owner> getOwner();
	
	public Owner currentOwner(Owner user);
	
	public Owner updateOwner(Owner user);
	
	public Owner deleteOwner(Owner user);
	
	public Owner getOwnerById(String id);

}