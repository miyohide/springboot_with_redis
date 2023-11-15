package com.github.miyohide.springboot_31;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {
  private final HttpSession httpSession;
  private static final Logger logger = LoggerFactory.getLogger(GreetingController.class);

  public GreetingController(HttpSession httpSession) {
    this.httpSession = httpSession;
  }

  @GetMapping("/")
  public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
    logger.info("HTTP Session id = [" + httpSession.getId() + "]");
    if (httpSession.isNew()) {
      httpSession.setAttribute("name", name);
    }
    return new Greeting(
        httpSession.getId(),
        (String) httpSession.getAttribute("name"),
        httpSession.getCreationTime());
  }

  @GetMapping("/goodbye")
  public String goodbye() {
    String httpSessionId = httpSession.getId();
    String name = httpSession.getAttribute("name").toString();
    httpSession.invalidate();
    return "bye. HTTP Session id = [" + httpSessionId + "], name = [" + name + "]";
  }
}
