<?php

namespace Tib\Bundle\InspirationBoardBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class DefaultController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        $repo = $this->getDoctrine()->getRepository('TibInspirationBoardBundle:Board');
        $board = $repo->findOneById(1);
        $_SESSION['isLoggedIn'] = true;
        return array('board' => $board);
    }
}
