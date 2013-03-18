<?php
// src/Sdz/BlogBundle/Entity/Article.php

namespace Sdz\BlogBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\ExecutionContextInterface;

/**
 * Sdz\BlogBundle\Entity\Article
 *
 * @ORM\Table(name="tut_article")
 * @ORM\Entity(repositoryClass="Sdz\BlogBundle\Entity\ArticleRepository")
 * @ORM\HasLifecycleCallbacks()
 * @Assert\Callback(methods={"contenuValide"})
 */
class Article
{
  /**
   * @ORM\Column(name="id", type="integer")
   * @ORM\Id
   * @ORM\GeneratedValue(strategy="AUTO")
   */
  private $id;

  /**
   * @ORM\Column(name="date", type="datetime")
   */
  private $date;

  /**
   * @ORM\Column(name="titre", type="string", length=255)
   */
  private $titre;

  /**
   * @ORM\Column(name="auteur", type="string", length=255, nullable=true)
   * Je mets cette colonne à nullable=true car maintenant on a aussi l'attribut $user
   */
  private $auteur;

  /**
   * @ORM\Column(name="publication", type="boolean")
   */
  private $publication;

  /**
   * @ORM\Column(name="contenu", type="text")
   */
  private $contenu;

  /**
   * @ORM\Column(type="date", nullable=true)
   */
  private $dateEdition;

  /**
   * @Gedmo\Slug(fields={"titre"})
   * @ORM\Column(length=128, unique=true)
   */
  private $slug;

  /**
   * @ORM\OneToOne(targetEntity="Sdz\BlogBundle\Entity\Image", cascade={"persist", "remove"})
   */
  private $image;

  /**
   * @ORM\ManyToMany(targetEntity="Sdz\BlogBundle\Entity\Categorie", cascade={"persist"})
   * @ORM\JoinTable(name="tut_article_categorie")
   */
  private $categories;

  /**
   * @ORM\OneToMany(targetEntity="Sdz\BlogBundle\Entity\Commentaire", mappedBy="article")
   */
  private $commentaires; // Ici commentaires prend un "s", car un article a plusieurs commentaires !

  /**
   * @ORM\OneToMany(targetEntity="Sdz\BlogBundle\Entity\ArticleCompetence", mappedBy="article")
   */
  private $articleCompetences;

  /**
   * @ORM\ManyToOne(targetEntity="Sdz\UserBundle\Entity\User")
   */
  private $user;

  public function __construct()
  {
    $this->publication  = true;
    $this->date         = new \Datetime;
    $this->categories   = new \Doctrine\Common\Collections\ArrayCollection();
    $this->commentaires = new \Doctrine\Common\Collections\ArrayCollection();
    $this->articleCompetences = new \Doctrine\Common\Collections\ArrayCollection();
  }

  /**
   * @ORM\PreUpdate
   * Callback pour mettre à jour la date d'édition à chaque modification de l'entité
   */
  public function updateDate()
  {
    $this->setDateEdition(new \Datetime());
  }

  public function getId()
  {
    return $this->id;
  }

  public function setDate(\Datetime $date)
  {
    $this->date = $date;
  }

  public function getDate()
  {
    return $this->date;
  }

  public function setTitre($titre)
  {
    $this->titre = $titre;
  }

  public function getTitre()
  {
    return $this->titre;
  }

  public function setContenu($contenu)
  {
    $this->contenu = $contenu;
  }

  public function getContenu()
  {
    return $this->contenu;
  }

  public function setPublication($publication)
  {
    $this->publication = $publication;
  }

  public function getPublication()
  {
    return $this->publication;
  }

  public function setAuteur($auteur)
  {
    $this->auteur = $auteur;
  }

  public function getAuteur()
  {
    return $this->auteur;
  }

  public function setImage(\Sdz\BlogBundle\Entity\Image $image = null)
  {
    $this->image = $image;
  }

  public function getImage()
  {
    return $this->image;
  }

  public function addCategorie(\Sdz\BlogBundle\Entity\Categorie $categorie)
  {
    $this->categories[] = $categorie;
  }

  public function removeCategorie(\Sdz\BlogBundle\Entity\Categorie $categorie)
  {
    $this->categories->removeElement($categorie);
  }

  public function getCategories()
  {
    return $this->categories;
  }

  public function addCommentaire(\Sdz\BlogBundle\Entity\Commentaire $commentaire)
  {
    $this->commentaires[] = $commentaire;
  }

  public function removeCommentaire(\Sdz\BlogBundle\Entity\Commentaire $commentaire)
  {
    $this->commentaires->removeElement($commentaire);
  }

  public function getCommentaires()
  {
    return $this->commentaires;
  }

  public function setDateEdition(\Datetime $dateEdition)
  {
    $this->dateEdition = $dateEdition;
  }

  public function getDateEdition()
  {
    return $this->dateEdition;
  }

  public function setSlug($slug)
  {
    $this->slug = $slug;
  }

  public function getSlug()
  {
    return $this->slug;
  }

  public function addArticleCompetence(\Sdz\BlogBundle\Entity\ArticleCompetence $articleCompetence)
  {
    $this->articleCompetences[] = $articleCompetence;
  }

  public function removeArticleCompetence(\Sdz\BlogBundle\Entity\ArticleCompetence $articleCompetence)
  {
    $this->articleCompetences->removeElement($articleCompetence);
  }

  public function getArticleCompetences()
  {
    return $this->articleCompetences;
  }

  public function setUser(\Sdz\UserBundle\Entity\User $user = null)
  {
    $this->user = $user;
  }

  public function getUser()
  {
    return $this->user;
  }

  public function contenuValide(ExecutionContextInterface $context)
  {
    $mots_interdits = array('échec', 'abandon');

    // On vérifie que le contenu ne contient pas l'un des mots
    if (preg_match('#'.implode('|', $mots_interdits).'#', $this->getContenu())) {
      // La règle est violée, on définit l'erreur et son message
      // 1er argument : on dit quel attribut l'erreur concerne, ici « contenu »
      // 2e argument : le message d'erreur
      $context->addViolationAt('contenu', 'Contenu invalide car il contient un mot interdit.', array(), null);
    }
  }
}
