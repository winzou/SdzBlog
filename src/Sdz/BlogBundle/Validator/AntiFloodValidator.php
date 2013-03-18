<?php

// src/Sdz/BlogBundle/Validator/AntiFloodValidator.php

namespace Sdz\BlogBundle\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\Request;

class AntiFloodValidator extends ConstraintValidator
{
  private $request;
  private $repository;

  // Les arguments déclarés dans la définition du service arrivent au constructeur
  // On doit les enregistrer dans l'objet pour pouvoir s'en resservir dans la méthode validate()
  public function __construct(Request $request, EntityManager $em)
  {
    $this->request    = $request;
    $this->repository = $em->getRepository('SdzBlogBundle:Commentaire');
  }

  public function validate($value, Constraint $constraint)
  {
    // On récupère l'IP de celui qui poste
    $ip = $this->request->server->get('REMOTE_ADDR');

    // On vérifie si cette IP a déjà posté un message il y a moins de 15 secondes
    if ($this->repository->isFlood($ip, $constraint->secondes)) {
      // C'est cette ligne qui déclenche l'erreur pour le formulaire, avec en argument le message :
      $this->context->addViolation($constraint->message, array('%secondes%' => $constraint->secondes));
    }
  }
}
