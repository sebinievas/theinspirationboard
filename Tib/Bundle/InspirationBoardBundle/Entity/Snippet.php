<?php

namespace Tib\Bundle\InspirationBoardBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Tib\Bundle\InspirationBoardBundle\Entity\Snippet;
 * 
 * @ORM\Entity
 * @ORM\Table(name="snippet")
 */
class Snippet extends Entity
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
     * @ORM\Column(type="string", length="255")
     * @Assert\NotBlank()
     */
    protected $image_path;
    
    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    protected $user;
    
    /**
     * @ORM\ManyToOne(targetEntity="Board", inversedBy="snippets")
     */
    protected $board;
    
    
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
    
    /**
     * Get active
     *
     * @return boolean 
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * Set image_path
     *
     * @param string $imagePath
     */
    public function setImagePath($imagePath)
    {
        $this->image_path = $imagePath;
    }

    /**
     * Get image_path
     *
     * @return string 
     */
    public function getImagePath()
    {
        return $this->image_path;
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
}