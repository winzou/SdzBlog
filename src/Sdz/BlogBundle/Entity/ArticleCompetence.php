<?php
// src/Sdz/BlogBundle/Entity/ArticleCompetence.php

namespace Sdz\BlogBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContextInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="tut_article_competence")
 * @Assert\Callback(methods={"niveauValid"})
 */
class ArticleCompetence
{
  /**
   * @ORM\Id
   * @ORM\ManyToOne(targetEntity="Sdz\BlogBundle\Entity\Article", inversedBy="articleCompetences")
   */
  private $article;

  /**
   * @ORM\Id
   * @ORM\ManyToOne(targetEntity="Sdz\BlogBundle\Entity\Competence")
   */
  private $competence;

  /**
   * Exemple intéressant ici : une liste de choix texte qu'on stocke en nombre dans la bdd, l'équivalent d'un ENUM en MySQL
   * @ORM\Column(type="integer")
   */
  private $niveau; // Ici j'ai un attribut de relation, que j'ai appelé "niveau"

  // Méthode statique pour retourner la liste de tous les niveaux possibles
  static public function getNiveaux()
  {
    return array('Débutant', 'Confirmé', 'Expert');
  }

  public function setNiveau($niveau)
  {
    $this->niveau = $niveau;
  }

  // Retourne le niveau sous forme d'entier, ce n'est donc pas la forme à afficher à nos visiteurs
  public function getNiveau()
  {
    return $this->niveau;
  }

  // Cette méthode retourne le niveau humainement lisible ("Débutant" au lieu de "0")
  public function getTextNiveau()
  {
    $niveaux = self::getNiveaux();
    return $niveaux[$this->niveau];
  }

  public function setArticle(\Sdz\BlogBundle\Entity\Article $article)
  {
    $article->addArticleCompetence($this);
    $this->article = $article;
  }

  public function getArticle()
  {
    return $this->article;
  }

  public function setCompetence(\Sdz\BlogBundle\Entity\Competence $competence)
  {
    $this->competence = $competence;
  }

  public function getCompetence()
  {
    return $this->competence;
  }

  // Callback pour valider la valeur du niveau
  public function isNiveauValid(ExecutionContextInterface $context)
  {
    if ((int) $this->niveau >= count(self::getNiveaux())) {
      // La règle est violée, on définit l'erreur et son message
      // 1er argument : on dit quel attribut l'erreur concerne, ici « contenu »
      // 2e argument : le message d'erreur
      $context->addViolationAt('niveau', sprintf('Niveau invalide, il doit être parmis "%s".', implode(', ', self::getNiveaux())));
    }
  }

  public function __toString()
  {
    return 'ArticleCompetence{'.$this->niveau.'}';//sprintf('[Article=%s|Competence=%s]', $this->getArticle()->getTitre(), $this->getCompetence()->getNom());
  }
}
