<?php

namespace winzou\CoreBundle\Response;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Bundle\TwigBundle\TwigEngine;

class ResponseListener
{
  protected $env;
  protected $twig;

  public function __construct($env, TwigEngine $twig)
  {
    $this->env  = $env;
    $this->twig = $twig;
  }

  public function onKernelResponse(FilterResponseEvent $event)
  {
    if (HttpKernelInterface::MASTER_REQUEST !== $event->getRequestType()) {
      return;
    }

    // Hors production, on n'affiche pas les outils google
    if ($this->env !== 'prod') {
      return;
    }

    $response = $event->getResponse();
    $request  = $event->getRequest();

    // Si on n'est pas dans un cas où on veut les outils google, on sort
    if (!$this->needInjection($request, $response)) {
      return;
    }

    $this->injectGoogle($response);
  }

  // Détermine si on veut les outils google (pas une requête ajax, etc.)
  protected function needInjection(Request $request, Response $response)
  {
    if ($request->isXmlHttpRequest()
      || '3' === substr($response->getStatusCode(), 0, 1)
      || ($response->headers->has('Content-Type') && false === strpos($response->headers->get('Content-Type'), 'html'))
      || 'html' !== $request->getRequestFormat()
    ) {
        return false;
    }

    return true;
  }

  // Injecte les outils google
  protected function injectGoogle(Response $response)
  {
    if (function_exists('mb_stripos')) {
      $posrFunction = 'mb_strripos';
      $substrFunction = 'mb_substr';
    } else {
      $posrFunction = 'strripos';
      $substrFunction = 'substr';
    }

    $content = $response->getContent();

    // Google Analytics est injecté juste avant le </body>
    if (false !== $pos = $posrFunction($content, '</body>')) {
      $content = $substrFunction($content, 0, $pos)
                 .$this->twig->render('winzouCoreBundle:Google:analytics.html.twig')
                 .$this->twig->render('winzouCoreBundle:Google:sharethis.html.twig')
                 .$substrFunction($content, $pos);
    }

    // Google Adsense est injecté à la balise winzouCoreBundle::injectAdsense
    if (false !== $pos = $posrFunction($content, '<!-- winzouCoreBundle::injectAdsense -->')) {
      $content = str_replace(
        '<!-- winzouCoreBundle::injectAdsense -->',
        $this->twig->render('winzouCoreBundle:Google:adsense.html.twig'),
        $content
      );
    }

    // On définit dans la réponse le contenu modifié
    $response->setContent($content);
  }
}