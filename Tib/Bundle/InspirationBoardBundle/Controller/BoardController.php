<?php

namespace Tib\Bundle\InspirationBoardBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class BoardController extends Controller
{
    /**
     * @Route("/boards/{id}", defaults={"id" = "null"})
     */
    public function processAction($id, Request $request)
    {
        // Validate user
        
        
        if ($request->getMethod() === 'POST')
        {
            
        }
        
        $em = $this->getDoctrine()->getEntityManager();
        $repo = $this->getDoctrine()->getRepository('TibInspirationBoardBundle:Board');
        
        $data = 'SEBI';
        
        $board = $repo->findOneById($id);
        $board->setElements($data);
        
        $em->persist($board);
        $em->flush();
        
        $response = new Response();
        $response->setContent(json_encode(array(
            'success' => true
        )));
        return $response;
    }
    
    /**
     * @Route("/boards")
     */
    public function listAction(Request $request)
    {
        $response = new Response();
        $response->setContent(json_encode(array(
            'success' => true
        )));
        return $response;
    }
}
