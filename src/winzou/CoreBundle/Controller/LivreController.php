<?php
// src/Sdz/BlogBundle/Controller/BlogController.php

namespace winzou\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class LivreController extends Controller
{
    public function indexAction()
    {
        return $this->render('winzouCoreBundle:Livre:index.html.twig');
    }

    public function codeSourceAction()
    {
        return $this->render('winzouCoreBundle:Livre:codeSource.html.twig');
    }
}