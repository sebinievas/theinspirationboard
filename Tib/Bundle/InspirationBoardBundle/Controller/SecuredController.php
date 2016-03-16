<?php

namespace Tib\Bundle\InspirationBoardBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class SecuredController extends Controller
{
    /**
     * @Route("/login_check")
     * @Template()
     */
    public function loginCheckAction()
    {
        return array();
    }
    
    /**
     * @Route("/logout")
     * @Template()
     */
    public function logoutAction()
    {
        return array();
    }
}
