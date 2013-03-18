<?php
// src/Sdz/BlogBundle/Entity/Competence.php

namespace Sdz\BlogBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Table(name="tut_competence")
 * @ORM\Entity(repositoryClass="Sdz\BlogBundle\Entity\CompetenceRepository")
 */
class Competence
{
  /**
   * @ORM\Column(name="id", type="integer")
   * @ORM\Id
   * @ORM\GeneratedValue(strategy="AUTO")
   */
  private $id;

  /**
   * @ORM\Column(name="nom", type="string", length=255)
   * @Assert\NotBlank()
   */
  private $nom;


  public function getId()
  {
    return $this->id;
  }

  public function setNom($nom)
  {
    $this->nom = $nom;
    return $this;
  }

  public function getNom()
  {
    return $this->nom;
  }

  // Cette méthode permet de faire "echo $competence"
  // Ainsi, pour "afficher" $competence, PHP affichera en réalité le retour de cette méthode
  // Ici, le nom, donc "echo $competence" est équivalent à "echo $competence->getNom()"
  public function __toString()
  {
    return $this->nom;
  }
}
