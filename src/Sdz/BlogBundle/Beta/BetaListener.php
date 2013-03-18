<?php
// src/Sdz/BlogBundle/Beta/BetaListener.php

namespace Sdz\BlogBundle\Beta;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;

class BetaListener
{
  // La date de fin de la version beta :
  // - Avant cette date, on affichera un compte à rebours (J-3 par exemple)
  // - Après cette date, on n'affichera plus le "beta"
  protected $dateFin;

  public function __construct($dateFin)
  {
    $this->dateFin = new \Datetime($dateFin);
  }

  // Méthode pour ajouter le "beta" à une réponse
  protected function displayBeta(Response $response, $joursRestant)
  {
    $content = $response->getContent();

    // Code à rajouter
    $html = '<span style="color: red; font-size: 0.5em;"> - Beta J-'.(int) $joursRestant.' !</span>';

    // Insertion du code dans la page, dans le <h1> du header
    $content = preg_replace('#<h1>(.*?)</h1>#iU',
                            '<h1>$1'.$html.'</h1>',
                            $content,
                            1);

    // Modification du contenu dans la réponse
    $response->setContent($content);

    return $response;
  }

  // Méthode qui est appelée par le gestionnaire d'évènements
  public function onKernelResponse(FilterResponseEvent $event)
  {
    // On récupère la réponse depuis l'évènement
    $response = $event->getResponse();

    if ($this->dateFin > new \Datetime()) {
      // On utilise notre méthode "reine"
      $joursRestant = $this->dateFin->diff(new \Datetime())->days;
      $response = $this->displayBeta($event->getResponse(), $joursRestant);
    }

    // On n'oublie pas d'enregistrer les modifications dans l'évènement
    $event->setResponse($response);

    // On stoppe la propagation de l'évènement en cours (ici, kernel.response)
    // $event->stopPropagation();
  }
}
