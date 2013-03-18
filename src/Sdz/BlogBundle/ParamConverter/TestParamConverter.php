<?php
// src/Sdz/BlogBundle/ParamConverter/TestParamConverter.php

namespace Sdz\BlogBundle\ParamConverter;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ConfigurationInterface;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManager;

class TestParamConverter implements ParamConverterInterface
{
  protected $class;
  protected $repository;

  public function __construct($class, EntityManager $em)
  {
    $this->class      = $class;
    $this->repository = $em->getRepository($class);
  }

  function supports(ConfigurationInterface $configuration)
  {
    // $conf->getClass() contient la classe de l'argument dans la méthode du contrôleur
    // On teste donc si cette classe correspond à notre classe Site, contenue dans $this->class
    return $configuration->getClass() == $this->class;
  }

  function apply(Request $request, ConfigurationInterface $configuration)
  {
    // On récupère l'entité Site correspondante
    $site = $this->repository->findOneByHostname($request->getHost());

    // On définit ensuite un attribut de requête du nom de $conf->getName()
    // et contenant notre entité Site
    $request->attributes->set($configuration->getName(), $site);

    // On retourne true pour qu'aucun autre ParamConverter ne soit utilisé sur cet argument
    // Je pense notamment au ParamConverter de Doctrine qui risque de vouloir s'appliquer !
    return true;
  }
}
