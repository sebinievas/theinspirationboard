<?php

namespace Tib\Bundle\InspirationBoardBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Tib\Bundle\InspirationBoardBundle\Entity\BoardSnippet;
 * 
 * @ORM\Entity
 * @ORM\Table(name="board_snippet")
 */
class BoardSnippet
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
    
    /**
     * @ORM\ManyToOne(targetEntity="Board")
     */
    protected $board;
    
    /**
     * @ORM\ManyToOne(targetEntity="Snippet")
     */
    protected $snippet;
}