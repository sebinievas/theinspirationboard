<?php

namespace Tib\Bundle\InspirationBoardBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Tib\Bundle\InspirationBoardBundle\Entity\Board;
 * 
 * @ORM\Entity
 * @ORM\Table(name="board")
 */
class Board extends Entity
{
    /**
     * @ORM\Column(type="string", length=150)
     * @Assert\NotBlank()
     */
    protected $name;
    
    /**
     * @ORM\Column(type="boolean", nullable=FALSE)
     */
    protected $active;
    
    /**
     * @ORM\Column(type="string", nullable=FALSE)
     */
    protected $visibility;
    
    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    protected $user;
    
    
    /**
     * @ORM\OneToMany(targetEntity="Snippet", mappedBy="board")
     */
    protected $snippets;
    
    
    public function __construct()
    {
        $this->snippets = new ArrayCollection();
    }
    
    public function setName($value)
    {
        $this->name = $value;
    }
    
    public function getName()
    {
        return $this->name;
    }
    
    public function setActive($value)
    {
        $this->active = ((bool) $value === true);
    }
    
    public function isActive()
    {
        return $this->active;
    }
    
    public function setVisibility($value)
    {
        $default = 'private';
        $allowed = array('private','public','members');
        
        if (!in_array($value, $allowed)) $value = $default;
        
        $this->visibility = $value;
    }
    
    public function getVisibility()
    {
        return $this->visibility;
    }
    
    /**
     * Set user
     *
     * @param Tib\Bundle\InspirationBoardBundle\Entity\User $user
     */
    public function setUser(\Tib\Bundle\InspirationBoardBundle\Entity\User $user)
    {
        $this->user = $user;
    }

    /**
     * Get user
     *
     * @return Tib\Bundle\InspirationBoardBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }
    
    /**
     * Add snippets
     *
     * @param \Tib\Bundle\InspirationBoardBundle\Entity\ $snippet
     */
    public function addSnippets(\Tib\Bundle\InspirationBoardBundle\Entity\Snippet $snippet)
    {
        $this->snippets[] = $snippet;
    }

    /**
     * Get snippets
     *
     * @return Doctrine\Common\Collections\Collection 
     */
    public function getSnippets()
    {
        return $this->snippets;
    }
}